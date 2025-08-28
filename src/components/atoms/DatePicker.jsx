import React, { useState, useRef, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isBefore, startOfDay } from "date-fns";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const DatePicker = React.forwardRef(({ 
  value, 
  onChange, 
  placeholder = "Select date...",
  error = false,
  minDate,
  className,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      days.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  const days = generateCalendarDays();
  const today = startOfDay(new Date());
  const selectedDate = value ? startOfDay(new Date(value)) : null;
  const effectiveMinDate = minDate ? startOfDay(new Date(minDate)) : today;

  const handleDateSelect = (date) => {
    // Prevent selection of past dates
    if (isBefore(date, effectiveMinDate)) {
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm");
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const formatDisplayValue = (dateValue) => {
    if (!dateValue) return "";
    try {
      const date = new Date(dateValue);
      return format(date, "MMM d, yyyy");
    } catch {
      return "";
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input Display */}
      <button
        type="button"
        ref={ref}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-gray-500 focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
          error && "border-error focus:border-error focus:ring-error",
          isOpen && "border-sky ring-2 ring-sky"
        )}
        {...props}
      >
        <span className={cn(
          !value && "text-gray-500"
        )}>
          {value ? formatDisplayValue(value) : placeholder}
        </span>
        <ApperIcon 
          name="Calendar" 
          size={16} 
          className={cn(
            "text-gray-400 transition-colors",
            isOpen && "text-sky"
          )} 
        />
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 min-w-[280px]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              className="p-1 h-8 w-8"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            
            <h3 className="font-medium text-charcoal">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="p-1 h-8 w-8"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, today);
              const isPastDate = isBefore(day, effectiveMinDate);
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={isPastDate}
                  className={cn(
                    "h-8 w-8 text-sm rounded-md transition-colors duration-200 flex items-center justify-center",
                    isCurrentMonth ? "text-charcoal" : "text-gray-300",
                    isSelected && "bg-sky text-white font-medium",
                    !isSelected && isToday && "bg-gray-100 font-medium",
                    !isSelected && !isPastDate && isCurrentMonth && "hover:bg-gray-100",
                    isPastDate && "opacity-40 cursor-not-allowed",
                    !isPastDate && "cursor-pointer"
                  )}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>

          {/* Today Button */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleDateSelect(new Date())}
              className="w-full text-sm"
            >
              Today
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = "DatePicker";

export default DatePicker;