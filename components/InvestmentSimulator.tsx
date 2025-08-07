import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, DollarSign, Calendar, Percent, Target, Zap, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface SimulationResult {
  year: number;
  balance: number;
  totalContributions: number;
  interestEarned: number;
}

interface InvestmentSimulatorProps {
  visible: boolean;
  onClose: () => void;
}

export default function InvestmentSimulator({ visible, onClose }: InvestmentSimulatorProps) {
  const [initialAmount, setInitialAmount] = useState('100');
  const [monthlyContribution, setMonthlyContribution] = useState('25');
  const [interestRate, setInterestRate] = useState('7');
  const [timeHorizon, setTimeHorizon] = useState('10');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [results, setResults] = useState<SimulationResult[]>([]);

  const calculateCompoundInterest = () => {
    const initial = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = (parseFloat(interestRate) || 0) / 100;
    const years = parseInt(timeHorizon) || 1;
    
    const monthlyRate = rate / 12;
    const totalMonths = years * 12;
    
    const simulationResults: SimulationResult[] = [];
    
    for (let year = 1; year <= years; year++) {
      const months = year * 12;
      
      // Future value of initial amount
      const futureValueInitial = initial * Math.pow(1 + monthlyRate, months);
      
      // Future value of monthly contributions (annuity)
      const futureValueContributions = monthly * 
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      
      const totalBalance = futureValueInitial + futureValueContributions;
      const totalContributions = initial + (monthly * months);
      const interestEarned = totalBalance - totalContributions;
      
      simulationResults.push({
        year,
        balance: totalBalance,
        totalContributions,
        interestEarned
      });
    }
    
    setResults(simulationResults);
  };

  useEffect(() => {
    calculateCompoundInterest();
  }, [initialAmount, monthlyContribution, interestRate, timeHorizon]);

  const finalResult = results[results.length - 1];
  const maxBalance = Math.max(...results.map(r => r.balance));

  const presetScenarios = [
    {
      name: 'Conservative Saver',
      initial: '50',
      monthly: '10',
      rate: '5',
      years: '5',
      emoji: '🐢'
    },
    {
      name: 'Steady Investor',
      initial: '100',
      monthly: '25',
      rate: '7',
      years: '10',
      emoji: '📈'
    },
    {
      name: 'Aggressive Growth',
      initial: '200',
      monthly: '50',
      rate: '10',
      years: '15',
      emoji: '🚀'
    },
    {
      name: 'Long-term Builder',
      initial: '100',
      monthly: '30',
      rate: '8',
      years: '20',
      emoji: '🏗️'
    }
  ];

  const applyPreset = (preset: typeof presetScenarios[0]) => {
    setInitialAmount(preset.initial);
    setMonthlyContribution(preset.monthly);
    setInterestRate(preset.rate);
    setTimeHorizon(preset.years);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F0F9FF', '#FFFFFF']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Investment Simulator 💎</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Investment Parameters</Text>
            
            <View style={styles.inputGrid}>
              {/* Initial Amount */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Initial Amount</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'initial' && styles.inputContainerFocused
                ]}>
                  <DollarSign color={focusedField === 'initial' ? '#3B82F6' : '#9CA3AF'} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="100"
                    placeholderTextColor="#9CA3AF"
                    value={initialAmount}
                    onChangeText={setInitialAmount}
                    keyboardType="numeric"
                    onFocus={() => setFocusedField('initial')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Monthly Contribution */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Monthly Savings</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'monthly' && styles.inputContainerFocused
                ]}>
                  <Calendar color={focusedField === 'monthly' ? '#3B82F6' : '#9CA3AF'} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="25"
                    placeholderTextColor="#9CA3AF"
                    value={monthlyContribution}
                    onChangeText={setMonthlyContribution}
                    keyboardType="numeric"
                    onFocus={() => setFocusedField('monthly')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Interest Rate */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Annual Return (%)</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'rate' && styles.inputContainerFocused
                ]}>
                  <Percent color={focusedField === 'rate' ? '#3B82F6' : '#9CA3AF'} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="7"
                    placeholderTextColor="#9CA3AF"
                    value={interestRate}
                    onChangeText={setInterestRate}
                    keyboardType="numeric"
                    onFocus={() => setFocusedField('rate')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Time Horizon */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Years to Invest</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'time' && styles.inputContainerFocused
                ]}>
                  <Target color={focusedField === 'time' ? '#3B82F6' : '#9CA3AF'} size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="10"
                    placeholderTextColor="#9CA3AF"
                    value={timeHorizon}
                    onChangeText={setTimeHorizon}
                    keyboardType="numeric"
                    onFocus={() => setFocusedField('time')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Preset Scenarios */}
          <View style={styles.presetsSection}>
            <Text style={styles.sectionTitle}>Try These Scenarios</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetsContainer}
            >
              {presetScenarios.map((preset, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.presetCard}
                  onPress={() => applyPreset(preset)}
                >
                  <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                  <Text style={styles.presetName}>{preset.name}</Text>
                  <Text style={styles.presetDetails}>
                    ${preset.initial} + ${preset.monthly}/mo
                  </Text>
                  <Text style={styles.presetDetails}>
                    {preset.rate}% for {preset.years} years
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Results Summary */}
          {finalResult && (
            <View style={styles.resultsSection}>
              <Text style={styles.sectionTitle}>Your Investment Results 🎯</Text>
              
              <View style={styles.summaryCards}>
                <View style={styles.summaryCard}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.summaryGradient}
                  >
                    <TrendingUp color="#FFFFFF" size={28} />
                    <Text style={styles.summaryValue}>
                      ${finalResult.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </Text>
                    <Text style={styles.summaryLabel}>Final Balance</Text>
                  </LinearGradient>
                </View>

                <View style={styles.summaryCard}>
                  <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={styles.summaryGradient}
                  >
                    <DollarSign color="#FFFFFF" size={28} />
                    <Text style={styles.summaryValue}>
                      ${finalResult.totalContributions.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </Text>
                    <Text style={styles.summaryLabel}>You Invested</Text>
                  </LinearGradient>
                </View>

                <View style={styles.summaryCard}>
                  <LinearGradient
                    colors={['#F59E0B', '#D97706']}
                    style={styles.summaryGradient}
                  >
                    <Zap color="#FFFFFF" size={28} />
                    <Text style={styles.summaryValue}>
                      ${finalResult.interestEarned.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </Text>
                    <Text style={styles.summaryLabel}>Interest Earned</Text>
                  </LinearGradient>
                </View>
              </View>

              {/* Growth Visualization */}
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Growth Over Time</Text>
                <View style={styles.chart}>
                  {results.map((result, index) => {
                    const height = (result.balance / maxBalance) * 120;
                    const contributionHeight = (result.totalContributions / maxBalance) * 120;
                    
                    return (
                      <View key={index} style={styles.chartBar}>
                        <View style={styles.barContainer}>
                          {/* Interest portion */}
                          <View style={[
                            styles.barSegment,
                            styles.interestBar,
                            { height: height - contributionHeight }
                          ]} />
                          {/* Contribution portion */}
                          <View style={[
                            styles.barSegment,
                            styles.contributionBar,
                            { height: contributionHeight }
                          ]} />
                        </View>
                        <Text style={styles.barLabel}>Y{result.year}</Text>
                      </View>
                    );
                  })}
                </View>
                
                {/* Legend */}
                <View style={styles.legend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#3B82F6' }]} />
                    <Text style={styles.legendText}>Your Contributions</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.legendText}>Interest Earned</Text>
                  </View>
                </View>
              </View>

              {/* Key Insights */}
              <View style={styles.insightsContainer}>
                <Text style={styles.insightsTitle}>💡 Key Insights</Text>
                <View style={styles.insightsList}>
                  <View style={styles.insightItem}>
                    <Text style={styles.insightEmoji}>🚀</Text>
                    <Text style={styles.insightText}>
                      Your money grew by {((finalResult.balance / finalResult.totalContributions - 1) * 100).toFixed(0)}% 
                      thanks to compound interest!
                    </Text>
                  </View>
                  
                  <View style={styles.insightItem}>
                    <Text style={styles.insightEmoji}>⏰</Text>
                    <Text style={styles.insightText}>
                      Time is your best friend - the longer you invest, the more powerful compound growth becomes.
                    </Text>
                  </View>
                  
                  <View style={styles.insightItem}>
                    <Text style={styles.insightEmoji}>💪</Text>
                    <Text style={styles.insightText}>
                      Regular monthly contributions help you build wealth steadily, even with small amounts.
                    </Text>
                  </View>
                  
                  {finalResult.interestEarned > finalResult.totalContributions && (
                    <View style={styles.insightItem}>
                      <Text style={styles.insightEmoji}>🎉</Text>
                      <Text style={styles.insightText}>
                        Amazing! You earned more from interest (${finalResult.interestEarned.toLocaleString('en-US', { maximumFractionDigits: 0 })}) 
                        than you actually invested (${finalResult.totalContributions.toLocaleString('en-US', { maximumFractionDigits: 0 })})!
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Educational Info */}
          <View style={styles.educationContainer}>
            <View style={styles.educationHeader}>
              <Info color="#3B82F6" size={20} />
              <Text style={styles.educationTitle}>Understanding Compound Interest</Text>
            </View>
            <View style={styles.educationContent}>
              <Text style={styles.educationText}>
                Compound interest is when you earn interest on both your original money AND the interest you've already earned. 
                It's like a snowball rolling down a hill - it starts small but grows bigger and faster as it goes!
              </Text>
              
              <View style={styles.educationTips}>
                <Text style={styles.tipsTitle}>💡 Smart Investing Tips:</Text>
                <Text style={styles.tipText}>• Start early - even small amounts can grow huge over time</Text>
                <Text style={styles.tipText}>• Be consistent - regular contributions add up fast</Text>
                <Text style={styles.tipText}>• Be patient - compound interest works best over many years</Text>
                <Text style={styles.tipText}>• Stay invested - don't withdraw your money early</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inputGroup: {
    width: (width - 52) / 2,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  inputContainerFocused: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    paddingVertical: 12,
    marginLeft: 8,
  },
  presetsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  presetsContainer: {
    paddingRight: 20,
    gap: 12,
  },
  presetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  presetEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  presetName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 6,
  },
  presetDetails: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },
  resultsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    marginBottom: 16,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 1,
  },
  barContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 120,
  },
  barSegment: {
    width: '100%',
    borderRadius: 2,
  },
  contributionBar: {
    backgroundColor: '#3B82F6',
  },
  interestBar: {
    backgroundColor: '#10B981',
  },
  barLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  insightsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  insightEmoji: {
    fontSize: 16,
    marginTop: 2,
  },
  insightText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
    lineHeight: 18,
  },
  educationContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  educationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  educationContent: {
    gap: 16,
  },
  educationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
  educationTips: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
    lineHeight: 16,
    marginBottom: 4,
  },
});