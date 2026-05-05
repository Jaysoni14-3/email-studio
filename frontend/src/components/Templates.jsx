const templates = [
    {
      id: 1,
      name: "Welcome Email",
      html: "<h1>Welcome 🎉</h1>"
    },
    {
      id: 2,
      name: "Promotion",
      html: "<h1>Big Sale 🔥</h1>"
    },
    {
      id: 3,
      name: "Newsletter",
      html: "<h1>Weekly Update</h1>"
    },
  ];
  
  export default function Templates({ onSelect, onBack }) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#eef2ff] p-10">
  
        <div className="max-w-6xl mx-auto">
  
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-semibold">Choose a Template</h2>
            <button onClick={onBack} className="text-sm text-gray-500">
              Back
            </button>
          </div>
  
          {/* Grid */}
          <div className="grid grid-cols-3 gap-8">
  
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => onSelect(tpl)}
                className="cursor-pointer group"
              >
  
                {/* Card */}
                <div className="h-[260px] bg-white rounded-xl shadow-md overflow-hidden transition group-hover:shadow-xl group-hover:-translate-y-1">
  
                  <iframe
                    title={tpl.name}
                    srcDoc={tpl.html}
                    className="w-full h-full border-none pointer-events-none"
                  />
                </div>
  
                <p className="mt-3 text-sm text-gray-600">
                  {tpl.name}
                </p>
  
              </div>
            ))}
  
          </div>
  
        </div>
      </div>
    );
  }