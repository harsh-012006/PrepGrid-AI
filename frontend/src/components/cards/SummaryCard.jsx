import { getInitials } from "../../utils/helper";

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdatedAt,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      className="bg-[#FFFFF8] rounded-xl p-2 overflow-hidden group px-2 border border-amber-100 hover:shadow-lg hover:shadow-amber-100 transition"
      onClick={onSelect}
    >
      <div
        className="rounded-lg p-4 cursor-pointer relative"
        style={{ background: colors.bgcolor }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-[#FF9324]/20 rounded-md flex items-center justify-center">
            <span className="text-lg font-semibold text-[#FF9324]">
              {getInitials(role)}
            </span>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-[17px] font-medium text-black">{role}</h2>
                <p className="text-xs text-medium text-gray-700 w-10/12">
                  {topicsToFocus}
                </p>
              </div>
              <button
                className="hidden group-hover:flex items-center justify-center w-8 h-8 text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                title="Delete session"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v1a2 2 0 002 2v6a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="flex  gap-1 mt-4">
              <div className="text-[10px] font-medium text-black px-3 py-1 border border-amber-200 rounded-md bg-amber-50">
                Experience: {experience} {experience === 1 ? "Year" : "Years"}
              </div>
              <div className="text-[10px] font-medium text-black px-3 py-1 border border-amber-200 rounded-md bg-amber-50">
                {questions} Q&A
              </div>
              <div className="text-[10px] font-medium text-black px-3 py-1 border border-amber-200 rounded-md bg-amber-50">
                Last Updated: {lastUpdatedAt}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-600 font-medium line-clamp-2 mt-4 capitalize px-2 pt-2">
        {description}
      </p>
    </div>
  );
};

export default SummaryCard;
