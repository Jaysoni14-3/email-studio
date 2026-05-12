import { useEffect, useMemo, useRef, useState } from "react";

import WorkspaceCanvas from "./builder/WorkspaceCanvas";
import ControlPanel from "./builder/ControlPanel";
import StatusPanel from "./builder/StatusPanel";
import {
  defaultState,
  extractEmails,
  formatHtml,
  isValidEmail,
  parseJsonResponse,
  templates,
} from "./builder/builderData";
import { wrapEmail } from "../utils/emailWrapper";
import { applyEmailIssueFix, validateEmailHtml } from "../utils/emailHtmlValidator";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const STORAGE_KEY = "email-studio-builder-state";
const RECIPIENT_HISTORY_KEY = "email-studio-recipient-history";

export default function Builder({ onBack }) {
  const [subject, setSubject] = useState(defaultState.subject);
  const [html, setHtml] = useState(defaultState.html);
  const htmlRef = useRef(defaultState.html);
  const [wrap, setWrap] = useState(defaultState.wrap);
  const [recipientInput, setRecipientInput] = useState("");
  const [recipients, setRecipients] = useState(defaultState.recipients);
  const [savedRecipients, setSavedRecipients] = useState([]);
  const [previewWidth, setPreviewWidth] = useState("desktop");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [sendResults, setSendResults] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isCheckingHealth, setIsCheckingHealth] = useState(true);
  const [serverInfo, setServerInfo] = useState({
    configured: false,
    fromEmail: "",
    fromName: "",
    reachable: false,
  });

  const updateHtml = (nextHtml) => {
    htmlRef.current = nextHtml;
    setHtml(nextHtml);
  };

  const pushToast = (type, message) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, type, message }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  };

  const simplifySendError = (rawMessage) => {
    const message = String(rawMessage || "").toLowerCase();
    if (!message) return "We could not send the email. Please try again.";
    if (message.includes("sender identity") || message.includes("from")) {
      return "Your sender email is not verified in SendGrid yet. Please verify it and try again.";
    }
    if (message.includes("unauthorized") || message.includes("permission")) {
      return "Your email provider key is invalid or missing permission. Please check your API key.";
    }
    if (message.includes("invalid") && message.includes("email")) {
      return "One or more email addresses are invalid. Please fix them and try again.";
    }
    if (message.includes("missing sendgrid_api_key")) {
      return "Server email key is missing. Please add SENDGRID_API_KEY in backend .env.";
    }
    if (message.includes("missing sendgrid_from_email")) {
      return "Sender email is missing. Please add SENDGRID_FROM_EMAIL in backend .env.";
    }
    return rawMessage || "We could not send the email. Please try again.";
  };

  useEffect(() => {
    try {
      const savedState = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");

      if (savedState) {
        setSubject(savedState.subject || defaultState.subject);
        updateHtml(savedState.html || defaultState.html);
        setWrap(savedState.wrap ?? defaultState.wrap);
        setRecipients(
          Array.isArray(savedState.recipients) && savedState.recipients.length > 0
            ? savedState.recipients
            : defaultState.recipients
        );
      }

      const savedRecipientHistory = JSON.parse(
        window.localStorage.getItem(RECIPIENT_HISTORY_KEY) || "[]"
      );

      if (Array.isArray(savedRecipientHistory)) {
        setSavedRecipients(
          [...new Set(savedRecipientHistory.map((email) => String(email).trim().toLowerCase()))].filter(
            isValidEmail
          )
        );
      }
    } catch {
      setStatus({
        type: "warning",
        message: "Saved draft data could not be restored.",
      });
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          subject,
          html,
          recipients,
          wrap,
        })
      );
    } catch {
      setStatus({
        type: "warning",
        message: "Changes could not be saved locally.",
      });
    }
  }, [subject, html, recipients, wrap]);

  useEffect(() => {
    try {
      window.localStorage.setItem(RECIPIENT_HISTORY_KEY, JSON.stringify(savedRecipients));
    } catch {
      setStatus({
        type: "warning",
        message: "Saved recipient history could not be updated locally.",
      });
    }
  }, [savedRecipients]);

  useEffect(() => {
    const loadServerHealth = async () => {
      setIsCheckingHealth(true);

      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await parseJsonResponse(response);

        if (!response.ok) throw new Error(data.message);

        setServerInfo({
          configured: Boolean(data.configured),
          fromEmail: data.fromEmail || "",
          fromName: data.fromName || "",
          reachable: true,
        });
      } catch {
        setServerInfo({
          configured: false,
          fromEmail: "",
          fromName: "",
          reachable: false,
        });
      } finally {
        setIsCheckingHealth(false);
      }
    };

    loadServerHealth();
  }, []);

  const previewDocument = useMemo(() => wrapEmail(html, wrap), [html, wrap]);
  const validationResult = useMemo(() => validateEmailHtml(html, wrap), [html, wrap]);
  const validRecipients = useMemo(() => recipients.filter(isValidEmail), [recipients]);
  const invalidRecipients = useMemo(
    () => recipients.filter((email) => !isValidEmail(email)),
    [recipients]
  );

  const addRecipients = () => {
    const nextEmails = extractEmails(recipientInput);
    if (!nextEmails.length) {
      pushToast("warning", "Please enter at least one email address before adding.");
      return;
    }

    setRecipients((current) => [...new Set([...current, ...nextEmails])]);
    setSavedRecipients((current) => [...new Set([...current, ...nextEmails.filter(isValidEmail)])]);
    setRecipientInput("");
    pushToast("success", `Added ${nextEmails.length} recipient${nextEmails.length > 1 ? "s" : ""}.`);
  };

  const handleRecipientKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    addRecipients();
  };

  const removeRecipient = (emailToRemove) => {
    setRecipients((current) => current.filter((email) => email !== emailToRemove));
  };

  const restoreSavedRecipient = (emailToAdd) => {
    if (!isValidEmail(emailToAdd)) {
      pushToast("warning", "That saved email address is invalid and could not be added.");
      return;
    }

    setRecipients((current) => [...new Set([...current, emailToAdd])]);
    pushToast("success", `${emailToAdd} is ready to receive the next test email.`);
  };

  const removeSavedRecipient = (emailToRemove) => {
    setSavedRecipients((current) => current.filter((email) => email !== emailToRemove));
    pushToast("success", `Removed ${emailToRemove} from saved recipients.`);
  };

  const applyTemplate = (template) => {
    setSubject(template.subject);
    updateHtml(template.html.trim());
  };

  const clearEditor = () => updateHtml("");

  const fixValidationIssue = (issue) => {
    const nextHtml = applyEmailIssueFix(htmlRef.current || html, issue);
    if (nextHtml !== (htmlRef.current || html)) {
      updateHtml(nextHtml);
      pushToast("success", `Applied fix: ${issue.fix?.label || "updated HTML"}.`);
    } else {
      pushToast("warning", "That issue could not be auto-fixed safely.");
    }
  };

  const resetStudio = () => {
    setSubject(defaultState.subject);
    updateHtml(defaultState.html);
    setRecipients(defaultState.recipients);
    setWrap(defaultState.wrap);
    setSendResults([]);
  };

  const sendTestEmails = async () => {
    const htmlToSend = (htmlRef.current || "").trim();
    if (!serverInfo.reachable || !subject.trim() || !htmlToSend || !validRecipients.length) {
      pushToast("warning", "Please fill subject, email content, and at least one valid recipient.");
      return;
    }

    setIsSending(true);
    setSendResults([]);
    pushToast("pending", "Sending your test email now...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-test-emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients: validRecipients, subject, html: htmlToSend, wrap }),
      });

      const data = await parseJsonResponse(response);
      if (!response.ok) {
        throw new Error(data.message || "Failed to send email.");
      }

      setSendResults(Array.isArray(data.results) ? data.results : []);
      if (data.failedCount > 0) {
        pushToast(
          "warning",
          `Sent ${data.sentCount || 0}, but ${data.failedCount} failed. Check details in status below.`
        );
      } else {
        pushToast("success", "Test email sent successfully.");
      }
    } catch (error) {
      pushToast("error", simplifySendError(error.message));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="builder-page min-h-screen bg-[#f7f5ef] text-slate-900">
      <header className="border-b border-slate-200/90 bg-white/70 px-4 py-4 backdrop-blur sm:px-5 md:px-8 md:py-5">
        <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="micro-interactive rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium sm:px-5"
          >
            Back
          </button>
          <button
            type="button"
            onClick={resetStudio}
            className="micro-interactive rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium sm:px-5"
          >
            Reset
          </button>
        </div>
      </header>

      <main className="builder-layout mx-auto flex w-full max-w-[1760px] flex-col gap-5 p-4 sm:gap-6 sm:p-5 md:flex-row md:gap-0 md:p-8">
        {/* LEFT — 70% */}
        <div className="builder-workspace order-2 overflow-visible rounded-[28px] bg-white md:order-1 md:w-[70%] md:flex-none md:rounded-[32px_0_0_32px] md:border-r md:border-slate-200">
          <WorkspaceCanvas
            html={html}
            setHtml={updateHtml}
            onFormat={() => updateHtml(formatHtml(htmlRef.current || html))}
            onClear={clearEditor}
            previewWidth={previewWidth}
            setPreviewWidth={setPreviewWidth}
            previewDocument={previewDocument}
            validationResult={validationResult}
            onFixIssue={fixValidationIssue}
          />
        </div>

        {/* RIGHT — 30% */}
        <div className="builder-panel order-1 md:order-2 md:w-[30%] md:flex-none">
          <ControlPanel
            subject={subject}
            setSubject={setSubject}
            wrap={wrap}
            setWrap={setWrap}
            recipientInput={recipientInput}
            setRecipientInput={setRecipientInput}
            onRecipientKeyDown={handleRecipientKeyDown}
            recipients={recipients}
            savedRecipients={savedRecipients}
            addRecipients={addRecipients}
            removeRecipient={removeRecipient}
            restoreSavedRecipient={restoreSavedRecipient}
            removeSavedRecipient={removeSavedRecipient}
            validRecipients={validRecipients}
            invalidRecipients={invalidRecipients}
            templates={templates}
            applyTemplate={applyTemplate}
            onSend={sendTestEmails}
            isSending={isSending}
            validationResult={validationResult}
          />
        </div>
      </main>

      <div className="mx-auto w-full max-w-[1760px] px-4 pb-4 sm:px-5 sm:pb-5 md:px-8 md:pb-8">
        <StatusPanel
          status={status}
          sendResults={sendResults}
          serverInfo={serverInfo}
          isCheckingHealth={isCheckingHealth}
        />
      </div>

      <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex w-auto max-w-sm flex-col gap-2 sm:left-auto sm:right-4 sm:w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-sm toast-item ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : toast.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : toast.type === "warning"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
