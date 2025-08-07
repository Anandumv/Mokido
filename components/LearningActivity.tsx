import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck as CheckCircle2, X, ArrowRight, Star, Trophy, Coins, BookOpen, ChevronRight } from 'lucide-react-native';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

interface LessonSlide {
  id: string;
  title: string;
  content: string;
  image?: string;
  keyPoints?: string[];
  example?: string;
}

interface LearningActivityProps {
  moduleId: string;
  title: string;
  questions: Question[];
  onComplete: (score: number, totalPoints: number) => void;
  onClose: () => void;
}

export default function LearningActivity({ 
  moduleId, 
  title, 
  questions, 
  onComplete, 
  onClose 
}: LearningActivityProps) {
  const [currentPhase, setCurrentPhase] = useState<'learning' | 'quiz'>('learning');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [fadeAnim] = useState(new Animated.Value(1));

  // Get lesson slides based on module
  const getLessonSlides = (moduleId: string): LessonSlide[] => {
    const slidesMap: { [key: string]: LessonSlide[] } = {
      '1': [
        {
          id: '1-1',
          title: 'Welcome to Money Basics! 💰',
          content: 'Money is something we use every day, but what exactly is it? Money is a tool that helps us trade and get the things we need and want.',
          keyPoints: [
            'Money is a tool for trading',
            'It helps us get what we need and want',
            'Everyone agrees money has value',
            'It makes life much easier!'
          ],
          example: 'Instead of trading 5 apples for a toy, you can sell the apples for money, then use that money to buy the toy!'
        },
        {
          id: '1-2',
          title: 'Before Money: The Barter System 🔄',
          content: 'Long ago, people didn\'t have money. They used something called "bartering" - trading items directly with each other.',
          keyPoints: [
            'People traded goods directly (apples for bread)',
            'You had to find someone who wanted what you had',
            'It was hard to agree on fair trades',
            'Money solved these problems!'
          ],
          example: 'A farmer with wheat needed shoes, but the shoemaker wanted fish, not wheat. The farmer had to find someone with fish who wanted wheat first!'
        },
        {
          id: '1-3',
          title: 'Types of Money 💳',
          content: 'Money comes in different forms. Each type serves the same purpose but works in different ways.',
          keyPoints: [
            'Coins - metal money that lasts a long time',
            'Paper bills - lightweight and easy to carry',
            'Digital money - stored on cards and phones',
            'All types have agreed-upon value'
          ],
          example: 'A $5 bill, five $1 coins, or $5 on a debit card all have the same buying power!'
        },
        {
          id: '1-4',
          title: 'Why Money Works So Well ⭐',
          content: 'Money is amazing because it solves the problems that bartering had. It\'s portable, divisible, and everyone accepts it.',
          keyPoints: [
            'Portable - easy to carry around',
            'Divisible - can be broken into smaller amounts',
            'Durable - lasts a long time',
            'Universally accepted - everyone takes it'
          ],
          example: 'You can carry $100 in your pocket, but carrying $100 worth of chickens would be impossible!'
        }
      ],
      '2': [
        {
          id: '2-1',
          title: 'What is Saving? 🏦',
          content: 'Saving means keeping some of your money safe instead of spending it all right away. It\'s like planting seeds for your future!',
          keyPoints: [
            'Saving = keeping money for later',
            'Don\'t spend everything immediately',
            'Your future self will thank you',
            'Small amounts add up over time'
          ],
          example: 'If you get $10 allowance, you might spend $7 and save $3 for something special later!'
        },
        {
          id: '2-2',
          title: 'Why Save Money? 🎯',
          content: 'Saving money helps you reach bigger goals, prepares you for surprises, and gives you more choices in life.',
          keyPoints: [
            'Buy bigger, better things later',
            'Be ready for emergencies',
            'Have more choices and freedom',
            'Feel secure and confident'
          ],
          example: 'Saving $2 per week for 25 weeks lets you buy a $50 video game instead of just $2 candy!'
        },
        {
          id: '2-3',
          title: 'Where to Keep Your Savings 🔒',
          content: 'Your savings need a safe place to live and grow. There are several good options, each with benefits.',
          keyPoints: [
            'Piggy bank - easy and fun to use',
            'Savings account - safe and earns interest',
            'Keep it organized and trackable',
            'Never lose track of your money'
          ],
          example: 'A savings account might pay you 50¢ extra for every $100 you save for a year!'
        },
        {
          id: '2-4',
          title: 'The Magic of Regular Saving ✨',
          content: 'Saving a little bit regularly is more powerful than saving a lot once in a while. Consistency is key!',
          keyPoints: [
            'Small amounts add up quickly',
            'Regular habits are easier to maintain',
            'You\'ll be surprised how fast it grows',
            'Start with any amount - even 25¢!'
          ],
          example: 'Saving just $1 per week gives you $52 after one year - enough for a nice gift!'
        }
      ],
      '3': [
        {
          id: '3-1',
          title: 'Needs vs Wants: The Big Difference 🤔',
          content: 'Understanding needs vs wants is one of the most important money skills. It helps you make smart choices with your money.',
          keyPoints: [
            'Needs = things you must have to live safely',
            'Wants = things that would be nice to have',
            'Both are okay, but needs come first',
            'This skill helps you prioritize spending'
          ],
          example: 'Food is a need (you must eat), but ice cream is a want (tasty but not necessary)!'
        },
        {
          id: '3-2',
          title: 'What Are Needs? 🏠',
          content: 'Needs are things required for your health, safety, and basic living. Without these, you could be in danger or unable to function.',
          keyPoints: [
            'Food and clean water',
            'Safe shelter and clothing',
            'Healthcare and medicine',
            'Education and basic transportation'
          ],
          example: 'A warm coat in winter is a need because you could get sick without it!'
        },
        {
          id: '3-3',
          title: 'What Are Wants? 🎮',
          content: 'Wants are things that make life more enjoyable but aren\'t necessary for survival. They\'re the "extras" in life.',
          keyPoints: [
            'Entertainment and hobbies',
            'Brand-name items when generic works',
            'Extra toys or gadgets',
            'Luxury foods and treats'
          ],
          example: 'A smartphone is often a want (unless needed for safety), while a basic phone might be a need!'
        },
        {
          id: '3-4',
          title: 'Making Smart Choices 🧠',
          content: 'When you have limited money, always take care of needs first. Then, if there\'s money left over, you can consider wants.',
          keyPoints: [
            'Always prioritize needs first',
            'Save some money before buying wants',
            'Ask: "What happens if I don\'t buy this?"',
            'Sometimes wants can wait'
          ],
          example: 'If you have $20: buy $15 school supplies (need) first, then consider a $5 toy (want)!'
        }
      ],
      '4': [
        {
          id: '4-1',
          title: 'What is Investing? 📈',
          content: 'Investing means putting your money into something that might grow in value over time. It\'s like planting money seeds!',
          keyPoints: [
            'Investing = money that might grow',
            'Different from just saving',
            'Takes time to see results',
            'Can help build wealth over time'
          ],
          example: 'Buying a share of a company for $10 that might be worth $15 next year!'
        },
        {
          id: '4-2',
          title: 'Types of Investments 🌱',
          content: 'There are many ways to invest money. Each type has different levels of risk and potential reward.',
          keyPoints: [
            'Stocks - owning pieces of companies',
            'Bonds - lending money to earn interest',
            'Real estate - buying property',
            'Starting a business'
          ],
          example: 'Buying stock in a toy company means you own a tiny piece of that business!'
        },
        {
          id: '4-3',
          title: 'Risk and Reward ⚖️',
          content: 'All investments have risk - they might lose money. But they also have the potential for higher rewards than just saving.',
          keyPoints: [
            'Higher potential rewards = higher risk',
            'Never invest money you can\'t afford to lose',
            'Diversification helps reduce risk',
            'Time helps smooth out ups and downs'
          ],
          example: 'A savings account is safe but grows slowly. Stocks are riskier but might grow much faster!'
        },
        {
          id: '4-4',
          title: 'Starting Young: Your Superpower! 🚀',
          content: 'Starting to invest when you\'re young is like having a superpower. Time is your best friend in investing!',
          keyPoints: [
            'More time = more potential growth',
            'Compound growth is powerful',
            'Start small and learn',
            'Mistakes are cheaper when young'
          ],
          example: 'Investing $100 at age 10 could be worth much more than investing $1000 at age 30!'
        }
      ],
      '5': [
        {
          id: '5-1',
          title: 'What is a Budget? 📊',
          content: 'A budget is a plan for your money. It helps you decide how much to spend, save, and invest before you actually do it.',
          keyPoints: [
            'A budget = a money plan',
            'Helps you make intentional choices',
            'Prevents overspending',
            'Helps you reach your goals faster'
          ],
          example: 'Planning to spend $10 on lunch, $5 on entertainment, and save $5 from your $20 allowance!'
        },
        {
          id: '5-2',
          title: 'The 50/30/20 Rule 📐',
          content: 'This simple rule helps you divide your money wisely: 50% for needs, 30% for wants, and 20% for savings and investing.',
          keyPoints: [
            '50% for needs (food, clothes, school)',
            '30% for wants (games, treats, fun)',
            '20% for savings and future goals',
            'Adjust percentages as needed'
          ],
          example: 'With $10: $5 for needs, $3 for wants, $2 for savings!'
        },
        {
          id: '5-3',
          title: 'Tracking Your Money 📝',
          content: 'Knowing where your money goes is just as important as planning where it should go. Tracking helps you stay on budget.',
          keyPoints: [
            'Write down what you spend',
            'Compare actual spending to your plan',
            'Look for patterns and surprises',
            'Adjust your budget when needed'
          ],
          example: 'If you planned $3 for snacks but spent $6, you\'ll know to plan better next time!'
        },
        {
          id: '5-4',
          title: 'Making Your Budget Work 🎯',
          content: 'A good budget is flexible and realistic. It should help you, not stress you out. Start simple and improve over time.',
          keyPoints: [
            'Start with simple categories',
            'Be realistic about your spending',
            'Review and adjust regularly',
            'Celebrate when you stick to it!'
          ],
          example: 'If your budget is too strict and you keep breaking it, make it more realistic!'
        }
      ],
      '6': [
        {
          id: '6-1',
          title: 'What is Interest? 💰',
          content: 'Interest is extra money you earn for letting someone else use your money, or extra money you pay for borrowing someone else\'s money.',
          keyPoints: [
            'Interest = extra money earned or paid',
            'Banks pay you interest on savings',
            'You pay interest when you borrow',
            'Usually shown as a percentage'
          ],
          example: 'If a bank pays 5% interest on $100, you earn $5 extra in one year!'
        },
        {
          id: '6-2',
          title: 'Simple vs Compound Interest 🌱',
          content: 'Simple interest is calculated only on your original money. Compound interest is calculated on your money PLUS any interest you\'ve already earned!',
          keyPoints: [
            'Simple interest = interest on original amount only',
            'Compound interest = interest on interest too!',
            'Compound interest grows much faster',
            'Time makes compound interest powerful'
          ],
          example: 'With compound interest, you earn interest on your $100, then earn interest on that interest too!'
        },
        {
          id: '6-3',
          title: 'The Power of Time ⏰',
          content: 'Time is the secret ingredient that makes compound interest amazing. The longer you wait, the more powerful it becomes.',
          keyPoints: [
            'More time = more compound growth',
            'Growth accelerates over time',
            'Starting early gives huge advantages',
            'Patience pays off literally!'
          ],
          example: 'Money that doubles every 10 years: $100 → $200 → $400 → $800 over 30 years!'
        },
        {
          id: '6-4',
          title: 'Making Compound Interest Work for You 🚀',
          content: 'To benefit from compound interest, save regularly, start early, and be patient. Let time do the heavy lifting!',
          keyPoints: [
            'Start saving as early as possible',
            'Save regularly, even small amounts',
            'Don\'t withdraw your earnings',
            'Be patient and let it grow'
          ],
          example: 'Saving $10/month from age 10 to 18 could grow to thousands by retirement!'
        }
      ]
    };

    return slidesMap[moduleId] || [];
  };

  const lessonSlides = getLessonSlides(moduleId);
  const currentSlide = lessonSlides[currentSlideIndex];
  const currentQuestion = questions[currentQuestionIndex];
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  // Progress calculations
  const learningProgress = ((currentSlideIndex + 1) / lessonSlides.length) * 100;
  const quizProgress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNextSlide = () => {
    if (currentSlideIndex < lessonSlides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      // Move to quiz phase
      setCurrentPhase('quiz');
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleStartQuiz = () => {
    setCurrentPhase('quiz');
  };

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      Alert.alert('Select an Answer', 'Please choose an answer before continuing!');
      return;
    }

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      setScore(prev => prev + currentQuestion.points);
      const newCompleted = [...completedQuestions];
      newCompleted[currentQuestionIndex] = true;
      setCompletedQuestions(newCompleted);
    }
  };

  const handleNextQuestion = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setIsCorrect(false);
      } else {
        // Activity completed
        onComplete(score + (isCorrect ? currentQuestion.points : 0), totalPoints);
      }
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderMultipleChoice = () => (
    <View style={styles.optionsContainer}>
      {currentQuestion.options?.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedAnswer === index && styles.optionButtonSelected,
            showExplanation && selectedAnswer === index && isCorrect && styles.optionButtonCorrect,
            showExplanation && selectedAnswer === index && !isCorrect && styles.optionButtonIncorrect,
            showExplanation && index === currentQuestion.correctAnswer && styles.optionButtonCorrect,
          ]}
          onPress={() => !showExplanation && handleAnswerSelect(index)}
          disabled={showExplanation}
        >
          <Text style={[
            styles.optionText,
            selectedAnswer === index && styles.optionTextSelected,
            showExplanation && index === currentQuestion.correctAnswer && styles.optionTextCorrect,
          ]}>
            {option}
          </Text>
          {showExplanation && index === currentQuestion.correctAnswer && (
            <CheckCircle2 color="#10B981" size={20} />
          )}
          {showExplanation && selectedAnswer === index && !isCorrect && (
            <X color="#EF4444" size={20} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTrueFalse = () => (
    <View style={styles.trueFalseContainer}>
      {['True', 'False'].map((option, index) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.trueFalseButton,
            selectedAnswer === index && styles.trueFalseButtonSelected,
            showExplanation && selectedAnswer === index && isCorrect && styles.trueFalseButtonCorrect,
            showExplanation && selectedAnswer === index && !isCorrect && styles.trueFalseButtonIncorrect,
            showExplanation && index === currentQuestion.correctAnswer && styles.trueFalseButtonCorrect,
          ]}
          onPress={() => !showExplanation && handleAnswerSelect(index)}
          disabled={showExplanation}
        >
          <Text style={[
            styles.trueFalseText,
            selectedAnswer === index && styles.trueFalseTextSelected,
            showExplanation && index === currentQuestion.correctAnswer && styles.trueFalseTextCorrect,
          ]}>
            {option}
          </Text>
          {showExplanation && index === currentQuestion.correctAnswer && (
            <CheckCircle2 color="#10B981" size={24} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  if (currentPhase === 'learning') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#F0F9FF', '#FFFFFF']}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.phaseIndicator}>
              <BookOpen color="#3B82F6" size={16} />
              <Text style={styles.phaseText}>Learning</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${learningProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Lesson {currentSlideIndex + 1} of {lessonSlides.length}
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Lesson Content */}
            <View style={styles.lessonCard}>
              <Text style={styles.lessonTitle}>{currentSlide.title}</Text>
              <Text style={styles.lessonContent}>{currentSlide.content}</Text>

              {/* Key Points */}
              {currentSlide.keyPoints && (
                <View style={styles.keyPointsContainer}>
                  <Text style={styles.keyPointsTitle}>Key Points:</Text>
                  {currentSlide.keyPoints.map((point, index) => (
                    <View key={index} style={styles.keyPoint}>
                      <Text style={styles.keyPointBullet}>•</Text>
                      <Text style={styles.keyPointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Example */}
              {currentSlide.example && (
                <View style={styles.exampleContainer}>
                  <Text style={styles.exampleTitle}>💡 Example:</Text>
                  <Text style={styles.exampleText}>{currentSlide.example}</Text>
                </View>
              )}
            </View>

            {/* Navigation */}
            <View style={styles.lessonNavigation}>
              {currentSlideIndex > 0 && (
                <TouchableOpacity style={styles.prevButton} onPress={handlePrevSlide}>
                  <Text style={styles.prevButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.navigationSpacer} />
              
              {currentSlideIndex < lessonSlides.length - 1 ? (
                <TouchableOpacity style={styles.nextButton} onPress={handleNextSlide}>
                  <Text style={styles.nextButtonText}>Next Lesson</Text>
                  <ChevronRight color="#FFFFFF" size={20} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.startQuizButton} onPress={handleStartQuiz}>
                  <Text style={styles.startQuizButtonText}>Start Quiz! 🎯</Text>
                  <ArrowRight color="#FFFFFF" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          {/* Lesson Indicators */}
          <View style={styles.indicatorsContainer}>
            {lessonSlides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentSlideIndex && styles.indicatorActive,
                  index < currentSlideIndex && styles.indicatorCompleted,
                ]}
              />
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  }

  // Quiz Phase (existing quiz code)
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F0F9FF', '#FFFFFF']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#6B7280" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.scoreContainer}>
            <Coins color="#F59E0B" size={16} />
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${quizProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
            {/* Question */}
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
              <View style={styles.pointsBadge}>
                <Star color="#F59E0B" size={16} />
                <Text style={styles.pointsText}>{currentQuestion.points} points</Text>
              </View>
            </View>

            {/* Answer Options */}
            {currentQuestion.type === 'multiple-choice' && renderMultipleChoice()}
            {currentQuestion.type === 'true-false' && renderTrueFalse()}

            {/* Explanation */}
            {showExplanation && (
              <View style={[
                styles.explanationContainer,
                isCorrect ? styles.explanationCorrect : styles.explanationIncorrect
              ]}>
                <View style={styles.explanationHeader}>
                  {isCorrect ? (
                    <CheckCircle2 color="#10B981" size={24} />
                  ) : (
                    <X color="#EF4444" size={24} />
                  )}
                  <Text style={[
                    styles.explanationTitle,
                    isCorrect ? styles.explanationTitleCorrect : styles.explanationTitleIncorrect
                  ]}>
                    {isCorrect ? 'Correct! 🎉' : 'Not quite right 🤔'}
                  </Text>
                </View>
                <Text style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
                {isCorrect && (
                  <View style={styles.rewardContainer}>
                    <Text style={styles.rewardText}>
                      +{currentQuestion.points} points earned! ⭐
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              {!showExplanation ? (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    selectedAnswer === null && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                >
                  <Text style={[
                    styles.submitButtonText,
                    selectedAnswer === null && styles.submitButtonTextDisabled
                  ]}>
                    Submit Answer
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Activity'}
                  </Text>
                  <ArrowRight color="#FFFFFF" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Question Indicators */}
        <View style={styles.indicatorsContainer}>
          {questions.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentQuestionIndex && styles.indicatorActive,
                completedQuestions[index] && styles.indicatorCompleted,
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
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
  title: {
    fontSize: 18,
    fontFamily: 'Fredoka-SemiBold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  phaseText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonTitle: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  lessonContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 20,
  },
  keyPointsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  keyPointsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  keyPointBullet: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginRight: 8,
    marginTop: 2,
  },
  keyPointText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  exampleContainer: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  exampleTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  lessonNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  prevButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  prevButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  navigationSpacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  startQuizButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  startQuizButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  questionContainer: {
    flex: 1,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    lineHeight: 26,
    marginBottom: 16,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  optionButtonCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  optionButtonIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
  },
  optionTextSelected: {
    color: '#3B82F6',
    fontFamily: 'Inter-SemiBold',
  },
  optionTextCorrect: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
  },
  trueFalseContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  trueFalseButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    gap: 8,
  },
  trueFalseButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  trueFalseButtonCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  trueFalseButtonIncorrect: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  trueFalseText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  trueFalseTextSelected: {
    color: '#3B82F6',
  },
  trueFalseTextCorrect: {
    color: '#10B981',
  },
  explanationContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  explanationCorrect: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  explanationIncorrect: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka-SemiBold',
  },
  explanationTitleCorrect: {
    color: '#10B981',
  },
  explanationTitleIncorrect: {
    color: '#EF4444',
  },
  explanationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  rewardContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    textAlign: 'center',
  },
  actionContainer: {
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  submitButtonTextDisabled: {
    color: '#9CA3AF',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  indicatorActive: {
    backgroundColor: '#3B82F6',
    width: 24,
  },
  indicatorCompleted: {
    backgroundColor: '#10B981',
  },
});