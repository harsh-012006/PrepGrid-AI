import React, { useRef, useState, useEffect } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "./AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10); // Add some padding
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-[#FFFFF8] rounded-lg mb-4 overflow-hidden py-5 px-5  border border-amber-100 group">
      <div className="flex items-start justify-between cursor-pointer">
        <div className="flex items-start gap-3.5" onClick={toggleExpand}>
          <span className="text-xs md:text-[15px] font-semibold text-[#FF9324]">
            Q
          </span>
          <h3 className="text-xs md:text-[14px] font-medium text-black mr-4">
            {question}
          </h3>
        </div>

        <div className="flex items-center justify-end ml-4 relative">
          <div className={`flex ${isExpanded ? "md:flex" : "md:hidden group-hover:flex"}`}>
            <button
              className=" hidden md:flex items-center gap-2 text-xs text-white font-medium bg-linear-to-r from-[#FF9324] to-[#e99a4b] px-3 h-5 mr-2 rounded text-nowrap border border-amber-200 hover:border-orange-500 cursor-pointer transition"
              onClick={onTogglePin}
            >
              {isPinned ? (
                <LuPinOff className="text-xs" />
              ) : (
                <LuPin className="text-xs" />
              )}
            </button>
            <button
              className="flex items-center gap-2 text-xs text-white font-medium bg-linear-to-r from-[#FF9324] to-[#e99a4b] px-3 h-5 mr-2 rounded text-nowrap border border-amber-200 hover:border-orange-500 cursor-pointer transition"
              onClick={() => {
                setIsExpanded(true);
                onLearnMore();
              }}
            >
              <LuSparkles />
              <span className="hidden md:block">Learn More</span>
            </button>
          </div>
          <button
            className="text-gray-600 ml-3 cursor-pointer"
            onClick={toggleExpand}
          >
            <LuChevronDown
              size={20}
              className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${height}px` }}
      >
        <div ref={contentRef} className="mt-4 text-gray-700 bg-amber-50 px-5 py-3 rounded-lg">
          {/* Assuming AIResponsePreview is a component that renders formatted content */}
          <AIResponsePreview content={answer} />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;