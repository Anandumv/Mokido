import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Calendar, ChevronLeft, ChevronRight, Check, X } from 'lucide-react-native';

interface DatePickerProps {
  value: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: any;
  disabled?: boolean;
}

export default function DatePicker({
  value,
  onDateChange,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
  style,
  disabled = false
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    value ? new Date(value) : new Date()
  );

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateSelect = () => {
    const formattedDate = formatDate(selectedDate);
    onDateChange(formattedDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setSelectedDate(value ? new Date(value) : new Date());
    setShowPicker(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const isDateDisabled = (day: number) => {
    if (!day) return true;
    
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    
    if (minimumDate && date < minimumDate) return true;
    if (maximumDate && date > maximumDate) return true;
    
    return false;
  };

  const isSelectedDay = (day: number) => {
    if (!day || !value) return false;
    
    const valueDate = new Date(value + 'T00:00:00');
    return (
      day === selectedDate.getDate() &&
      selectedDate.getMonth() === valueDate.getMonth() &&
      selectedDate.getFullYear() === valueDate.getFullYear()
    );
  };

  const handleDayPress = (day: number) => {
    if (!day || isDateDisabled(day)) return;
    
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <TouchableOpacity
        style={[styles.dateInput, style, disabled && styles.dateInputDisabled]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <Calendar color={disabled ? '#9CA3AF' : '#6B7280'} size={20} />
        <Text style={[
          styles.dateText,
          !value && styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleDateSelect}>
              <Check color="#10B981" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarContainer}>
            {/* Month/Year Header */}
            <View style={styles.monthHeader}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth('prev')}
              >
                <ChevronLeft color="#6B7280" size={24} />
              </TouchableOpacity>
              
              <Text style={styles.monthYearText}>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </Text>
              
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth('next')}
              >
                <ChevronRight color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>

            {/* Day Names Header */}
            <View style={styles.dayNamesContainer}>
              {dayNames.map((dayName) => (
                <Text key={dayName} style={styles.dayNameText}>
                  {dayName}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {getDaysInMonth(selectedDate).map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    !day && styles.emptydayCell,
                    isSelectedDay(day || 0) && styles.selectedDayCell,
                    isDateDisabled(day || 0) && styles.disabledDayCell
                  ]}
                  onPress={() => handleDayPress(day || 0)}
                  disabled={!day || isDateDisabled(day || 0)}
                >
                  {day && (
                    <Text style={[
                      styles.dayText,
                      isSelectedDay(day) && styles.selectedDayText,
                      isDateDisabled(day) && styles.disabledDayText
                    ]}>
                      {day}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Date Options */}
            <View style={styles.quickDatesContainer}>
              <TouchableOpacity
                style={styles.quickDateButton}
                onPress={() => {
                  const today = new Date();
                  setSelectedDate(today);
                }}
              >
                <Text style={styles.quickDateText}>Today</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickDateButton}
                onPress={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  setSelectedDate(nextWeek);
                }}
              >
                <Text style={styles.quickDateText}>Next Week</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickDateButton}
                onPress={() => {
                  const nextMonth = new Date();
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setSelectedDate(nextMonth);
                }}
              >
                <Text style={styles.quickDateText}>Next Month</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dateInputDisabled: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  modalButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  calendarContainer: {
    flex: 1,
    padding: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYearText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayNameText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  emptydayCell: {
    backgroundColor: 'transparent',
  },
  selectedDayCell: {
    backgroundColor: '#10B981',
  },
  disabledDayCell: {
    backgroundColor: '#F9FAFB',
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  disabledDayText: {
    color: '#D1D5DB',
  },
  quickDatesContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  quickDateButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  quickDateText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});