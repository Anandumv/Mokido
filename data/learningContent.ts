export interface LearningQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

export interface ModuleContent {
  [key: string]: {
    introduction: string;
    learningObjectives: string[];
    questions: LearningQuestion[];
    conclusion: string;
    funFacts: string[];
  };
}

export const moduleContent: ModuleContent = {
  '1': {
    introduction: "Hi there! Let's learn about money! 💰 Money is something we see every day. Do you know what it is and why we use it? Let's find out together!",
    learningObjectives: [
      "Learn what money is and why we use it",
      "See different kinds of money like coins and bills",
      "Find out how money helps us get things we want",
      "Know what coins and bills look like"
    ],
    questions: [
      {
        id: '1-1',
        type: 'multiple-choice',
        question: "What do we use money for?",
        options: [
          "To buy things like food and toys",
          "To throw in the trash",
          "To color on like paper",
          "To hide under our bed"
        ],
        correctAnswer: 0,
        explanation: "Great job! We use money to buy things we need like food and clothes, and things we want like toys and games. Money helps us get the things we want!",
        points: 10
      },
      {
        id: '1-2',
        type: 'true-false',
        question: "A long time ago, people traded things like apples for bread instead of using money.",
        correctAnswer: 0,
        explanation: "That's right! A long time ago, people would trade things they had for things they wanted. Like trading apples for bread! Money made this much easier.",
        points: 10
      },
      {
        id: '1-3',
        type: 'multiple-choice',
        question: "Which one of these is NOT money?",
        options: [
          "Coins",
          "Dollar bills",
          "Your mom's credit card",
          "Rocks from outside"
        ],
        correctAnswer: 3,
        explanation: "Great! Coins, dollar bills, and credit cards are all types of money, but rocks from outside are not money. We use special money that everyone knows has value!",
        points: 15
      },
      {
        id: '1-4',
        type: 'multiple-choice',
        question: "Why is using money easier than trading toys for food?",
        options: [
          "Money is easier to carry",
          "Everyone knows what money is worth",
          "You don't need to find someone who wants your exact toy",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "Perfect! Money is great because it's easy to carry, everyone knows what it's worth, and you don't need to find someone who wants your exact toy. Money makes buying things much easier!",
        points: 15
      },
      {
        id: '1-5',
        type: 'true-false',
        question: "Some people use cards and phones to pay for things instead of coins and bills.",
        correctAnswer: 0,
        explanation: "That's right! Some grown-ups use cards and phones to pay for things. This is still real money - it's just stored in a different way!",
        points: 10
      }
    ],
    conclusion: "Wow! You did great! 🎉 You learned that money helps us get the things we need and want. Money is special because everyone knows it has value!",
    funFacts: [
      "🐚 A long time ago, people used pretty seashells as money!",
      "🧀 Some people even used cheese as money!",
      "🎨 Money has pictures of important people on it",
      "💳 Some grown-ups use cards instead of coins and bills!"
    ]
  },
  '2': {
    introduction: "Let's learn about saving money! 🏦 Saving means keeping some of your money safe instead of spending it all right away. It's like keeping your favorite toys safe so you can play with them later!",
    learningObjectives: [
      "Learn what saving money means",
      "Find out why saving is a good idea",
      "See different ways to save money",
      "Make your first savings goal"
    ],
    questions: [
      {
        id: '2-1',
        type: 'multiple-choice',
        question: "What does saving money mean?",
        options: [
          "Spend all your money right now",
          "Keep some money safe for later",
          "Give all your money to someone else",
          "Lose your money"
        ],
        correctAnswer: 1,
        explanation: "Great job! Saving money means keeping some of your money safe so you can use it later for something special. It's like keeping treasure for later!",
        points: 10
      },
      {
        id: '2-2',
        type: 'true-false',
        question: "You should spend all your money as soon as you get it.",
        correctAnswer: 1,
        explanation: "That's right - you should NOT spend all your money right away! When you save some money, you can buy bigger and better things later!",
        points: 10
      },
      {
        id: '2-3',
        type: 'multiple-choice',
        question: "Where is the best place to keep your saved money?",
        options: [
          "Under your pillow",
          "In your pocket",
          "In a piggy bank",
          "On the floor"
        ],
        correctAnswer: 2,
        explanation: "Great choice! A piggy bank keeps your money safe and in one place. Some grown-ups also use special bank accounts to keep money safe!",
        points: 15
      },
      {
        id: '2-4',
        type: 'multiple-choice',
        question: "If you save $1 every week for 5 weeks, how much will you have?",
        options: [
          "$3",
          "$5",
          "$7",
          "$10"
        ],
        correctAnswer: 1,
        explanation: "Perfect! $1 × 5 weeks = $5. This shows how saving a little bit each week adds up to more money. Even saving small amounts helps!",
        points: 15
      },
      {
        id: '2-5',
        type: 'multiple-choice',
        question: "Why is saving money a good idea?",
        options: [
          "To buy something special later",
          "To have money when you need it",
          "To help your family",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "Wonderful! All of these are great reasons to save. Saving helps you get special things, have money when you need it, and even help your family!",
        points: 10
      }
    ],
    conclusion: "You did amazing! 🌟 You learned that saving money helps you get special things and be ready for when you need money. Every dollar you save helps you get closer to something special!",
    funFacts: [
      "🐷 Piggy banks are called that because they look like little pigs!",
      "🌱 When you save money in a bank, it can grow bigger over time!",
      "🎯 Kids who save money are better at getting things they want",
      "💡 Even saving pennies and nickels can add up to lots of money!"
    ]
  },
  '3': {
    introduction: "Let's learn about needs vs wants! 🤔 This is one of the most important money skills. Understanding the difference helps you make smart spending choices!",
    learningObjectives: [
      "Understand the difference between needs and wants",
      "Learn to categorize expenses",
      "Make better spending decisions",
      "Practice prioritizing purchases"
    ],
    questions: [
      {
        id: '3-1',
        type: 'multiple-choice',
        question: "Which of these is a NEED?",
        options: [
          "A new video game",
          "Food for dinner",
          "A second bicycle",
          "Candy"
        ],
        correctAnswer: 1,
        explanation: "Excellent! Food is a need because your body requires it to stay healthy and strong. Needs are things you must have to live safely and healthily.",
        points: 10
      },
      {
        id: '3-2',
        type: 'multiple-choice',
        question: "Which of these is a WANT?",
        options: [
          "A warm coat in winter",
          "Medicine when you're sick",
          "A designer backpack when you already have one",
          "Healthy food"
        ],
        correctAnswer: 2,
        explanation: "That's right! A designer backpack when you already have a working one is a want. Wants are things that would be nice to have but aren't necessary for your health and safety.",
        points: 10
      },
      {
        id: '3-3',
        type: 'true-false',
        question: "You should always buy your wants before your needs.",
        correctAnswer: 1,
        explanation: "Correct! You should take care of your needs first, then use any leftover money for wants. This ensures you have what you need to stay healthy and safe.",
        points: 15
      },
      {
        id: '3-4',
        type: 'multiple-choice',
        question: "You have $20. You need school supplies ($15) and want a toy ($10). What should you do?",
        options: [
          "Buy the toy first",
          "Buy the school supplies first",
          "Buy neither",
          "Ask someone else to pay"
        ],
        correctAnswer: 1,
        explanation: "Smart thinking! Buy the school supplies first because they're a need for your education. You'll have $5 left over to save toward the toy, which is a want.",
        points: 15
      },
      {
        id: '3-5',
        type: 'multiple-choice',
        question: "Which strategy helps you tell needs from wants?",
        options: [
          "Ask yourself: 'Will I be okay without this?'",
          "Think about what would happen if you don't buy it",
          "Consider if it's for health, safety, or basic living",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "Perfect! All these strategies help you make smart decisions. When you pause and think about whether something is truly necessary, you become a wiser spender!",
        points: 10
      }
    ],
    conclusion: "Fantastic! 🎊 You now know how to tell the difference between needs and wants. This skill will help you make smart money choices throughout your life!",
    funFacts: [
      "🧠 Your brain sometimes tricks you into thinking wants are needs - that's normal!",
      "📝 Making a list before shopping helps you stick to buying needs first",
      "⏰ Waiting 24 hours before buying a want can help you decide if you really need it",
      "💰 People who understand needs vs wants tend to save more money!"
    ]
  },
  '4': {
    introduction: "Welcome to investing! 📈 Investing is like planting money seeds that can grow into money trees over time. Let's learn how to make your money work for you!",
    learningObjectives: [
      "Understand what investing means",
      "Learn about different types of investments",
      "Discover how investments can grow over time",
      "Understand risk and reward"
    ],
    questions: [
      {
        id: '4-1',
        type: 'multiple-choice',
        question: "What does it mean to invest money?",
        options: [
          "Spend it on candy",
          "Put it somewhere it might grow over time",
          "Give it away for free",
          "Hide it under your bed"
        ],
        correctAnswer: 1,
        explanation: "Perfect! Investing means putting your money into something (like stocks or bonds) where it has the potential to grow and become more money over time. It's like planting seeds for future wealth!",
        points: 10
      },
      {
        id: '4-2',
        type: 'true-false',
        question: "All investments are guaranteed to make money.",
        correctAnswer: 1,
        explanation: "That's right - investments are NOT guaranteed! Sometimes they go up in value, sometimes they go down. That's why it's called 'risk' - but over long periods, many investments tend to grow.",
        points: 15
      },
      {
        id: '4-3',
        type: 'multiple-choice',
        question: "Which is an example of an investment?",
        options: [
          "Buying candy",
          "Buying a stock in a company",
          "Spending money on movies",
          "Buying clothes you need"
        ],
        correctAnswer: 1,
        explanation: "Excellent! Buying stock means you own a tiny piece of a company. If the company does well, your stock might become worth more money. The other options are just spending money.",
        points: 15
      },
      {
        id: '4-4',
        type: 'multiple-choice',
        question: "Why might someone choose to invest instead of just saving?",
        options: [
          "Investments might grow faster than savings",
          "It's more exciting",
          "Everyone else is doing it",
          "It's always safer"
        ],
        correctAnswer: 0,
        explanation: "Great reasoning! While savings accounts are safe, they usually grow slowly. Investments have the potential to grow much faster over time, though they come with more risk. It's about balancing safety and growth!",
        points: 20
      },
      {
        id: '4-5',
        type: 'multiple-choice',
        question: "What's the most important rule about investing?",
        options: [
          "Invest all your money at once",
          "Only invest money you can afford to lose",
          "Always follow what others are doing",
          "Invest only in one thing"
        ],
        correctAnswer: 1,
        explanation: "Absolutely right! Never invest money you need for important things like food, shelter, or emergencies. Only invest extra money that you can afford to lose if the investment doesn't work out.",
        points: 15
      }
    ],
    conclusion: "Outstanding! 🚀 You've learned the basics of investing - how to potentially grow your money over time. Remember: start small, learn lots, and never invest money you can't afford to lose!",
    funFacts: [
      "📊 The stock market has grown an average of about 10% per year over the last 100 years!",
      "🕰️ The earlier you start investing, the more time your money has to grow",
      "🏢 When you buy stock, you become a part-owner of that company!",
      "🎯 Diversification means spreading your investments around to reduce risk"
    ]
  },
  '5': {
    introduction: "Time to master budgeting! 📊 A budget is like a plan for your money - it helps you decide how to spend, save, and invest wisely. Let's create your first budget!",
    learningObjectives: [
      "Understand what a budget is",
      "Learn the 50/30/20 rule",
      "Practice creating a simple budget",
      "Track income and expenses"
    ],
    questions: [
      {
        id: '5-1',
        type: 'multiple-choice',
        question: "What is a budget?",
        options: [
          "A plan for how to use your money",
          "A type of bank account",
          "A way to get free money",
          "A kind of investment"
        ],
        correctAnswer: 0,
        explanation: "Perfect! A budget is a plan that helps you decide how to divide your money between spending, saving, and other goals. It's like a roadmap for your money!",
        points: 10
      },
      {
        id: '5-2',
        type: 'multiple-choice',
        question: "In the 50/30/20 rule, what does the 50% represent?",
        options: [
          "Fun money",
          "Savings",
          "Needs (like food and shelter)",
          "Investments"
        ],
        correctAnswer: 2,
        explanation: "Exactly right! In the 50/30/20 rule, 50% goes to needs (things you must have), 30% goes to wants (things you'd like to have), and 20% goes to savings and investments.",
        points: 15
      },
      {
        id: '5-3',
        type: 'multiple-choice',
        question: "You earn $10 from chores. Using the 50/30/20 rule, how much should you save?",
        options: [
          "$1",
          "$2",
          "$3",
          "$5"
        ],
        correctAnswer: 1,
        explanation: "Great math! 20% of $10 is $2. So you'd save $2, spend $5 on needs, and have $3 for wants. This helps you build good money habits early!",
        points: 15
      },
      {
        id: '5-4',
        type: 'true-false',
        question: "A budget should be flexible and can be adjusted when your situation changes.",
        correctAnswer: 0,
        explanation: "Absolutely! Budgets should be flexible. As your income changes or you have new goals, you can adjust your budget. The important thing is to have a plan and stick to it as much as possible.",
        points: 10
      },
      {
        id: '5-5',
        type: 'multiple-choice',
        question: "What's the first step in creating a budget?",
        options: [
          "Start spending money",
          "Figure out how much money you have coming in",
          "Buy everything you want",
          "Ask friends what they spend money on"
        ],
        correctAnswer: 1,
        explanation: "Excellent! You need to know your income (money coming in) before you can plan how to spend it. This includes allowance, gift money, and earnings from chores or jobs.",
        points: 10
      }
    ],
    conclusion: "Incredible work! 🎉 You now know how to create and use a budget to manage your money wisely. This skill will serve you well throughout your entire life!",
    funFacts: [
      "📱 There are apps that can help you track your budget automatically!",
      "🎯 People with budgets are 3x more likely to reach their financial goals",
      "💡 The envelope method involves putting cash in different envelopes for different expenses",
      "📈 Budgeting helps you see where your money really goes each month"
    ]
  },
  '6': {
    introduction: "Let's explore compound interest! 🌱 This is often called the 'eighth wonder of the world' because it can make your money grow amazingly fast over time!",
    learningObjectives: [
      "Understand what interest is",
      "Learn about compound interest",
      "See how time affects growth",
      "Calculate simple interest examples"
    ],
    questions: [
      {
        id: '6-1',
        type: 'multiple-choice',
        question: "What is interest?",
        options: [
          "Money the bank pays you for keeping your money there",
          "A fee you pay to the bank",
          "The same as your savings balance",
          "Money you owe someone"
        ],
        correctAnswer: 0,
        explanation: "Excellent! Interest is like a reward the bank gives you for letting them use your money. They pay you a percentage of your savings as a thank you!",
        points: 10
      },
      {
        id: '6-2',
        type: 'multiple-choice',
        question: "What makes compound interest special?",
        options: [
          "It only works for rich people",
          "You earn interest on your interest",
          "It's guaranteed to double your money",
          "It only works with large amounts"
        ],
        correctAnswer: 1,
        explanation: "That's right! Compound interest means you earn interest on your original money PLUS interest on the interest you've already earned. It's like interest earning interest!",
        points: 15
      },
      {
        id: '6-3',
        type: 'multiple-choice',
        question: "You save $100 at 5% annual interest. After one year, how much will you have?",
        options: [
          "$100",
          "$105",
          "$110",
          "$150"
        ],
        correctAnswer: 1,
        explanation: "Perfect calculation! $100 + (5% of $100) = $100 + $5 = $105. That extra $5 is the interest you earned just for saving your money!",
        points: 15
      },
      {
        id: '6-4',
        type: 'true-false',
        question: "The longer you leave your money invested, the more powerful compound interest becomes.",
        correctAnswer: 0,
        explanation: "Absolutely true! Time is compound interest's best friend. The longer your money stays invested, the more time it has to grow and compound. Starting early is one of the best financial decisions you can make!",
        points: 20
      },
      {
        id: '6-5',
        type: 'multiple-choice',
        question: "If you start with $100 and it doubles every 10 years, how much will you have after 20 years?",
        options: [
          "$200",
          "$300",
          "$400",
          "$500"
        ],
        correctAnswer: 2,
        explanation: "Amazing math! After 10 years: $100 becomes $200. After 20 years: $200 becomes $400. This shows the incredible power of compound growth over time!",
        points: 20
      }
    ],
    conclusion: "Amazing! 🚀 You've discovered the power of compound interest - one of the most important concepts in finance. Remember: time + patience + compound interest = financial success!",
    funFacts: [
      "💰 Albert Einstein supposedly called compound interest 'the most powerful force in the universe'",
      "⏰ Starting to save at age 10 vs age 20 can mean hundreds of thousands more dollars by retirement!",
      "📈 The 'Rule of 72' helps estimate how long it takes money to double with compound interest",
      "🎯 Even small amounts can grow to large sums with enough time and compound interest"
    ]
  }
};