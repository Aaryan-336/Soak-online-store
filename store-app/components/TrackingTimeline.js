export default function TrackingTimeline({ status }) {
    const steps = [
      { label: "Processing", key: "Processing" },
      { label: "Shipped", key: "Shipped" },
      { label: "Out for Delivery", key: "Out for Delivery" },
      { label: "Delivered", key: "Delivered" },
    ];
  
    // Determine which steps are complete
    const currentIndex = steps.findIndex((s) => s.key === status);
  
    return (
      <div className="mt-4">
        <div className="flex justify-between items-center relative">
          {/* Line behind circles */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300 -z-10"></div>
  
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              {/* Circle */}
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${i <= currentIndex ? "bg-royal-green text-white" : "bg-gray-300 text-gray-600"}
                `}
              >
                {i + 1}
              </div>
  
              {/* Label */}
              <div
                className={`text-xs mt-2 text-center ${
                  i <= currentIndex ? "text-royal-green font-medium" : "text-gray-500"
                }`}
              >
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  