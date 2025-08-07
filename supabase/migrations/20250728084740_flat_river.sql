/*
  # Insert Initial Data

  1. Learning Modules
    - Basic financial education content for kids aged 6-9
    - Progressive difficulty levels
    - Age-appropriate topics

  2. Missions
    - Household chores and tasks
    - Different difficulty levels and rewards
    - Various categories
*/

-- Insert learning modules
INSERT INTO learning_modules (id, title, description, category, difficulty, xp_reward, duration, age_groups, icon, lessons) VALUES
('1', 'What is Money?', 'Learn what money is and why we use it every day', 'Basics', 'Beginner', 50, '8 min', '{"6-9"}', '💰', 4),
('2', 'Saving Money is Fun!', 'Learn how to save money and why it makes you feel good', 'Saving', 'Beginner', 60, '10 min', '{"6-9"}', '🏦', 4),
('3', 'Things I Need vs Things I Want', 'Learn the difference between things you need and things you want', 'Budgeting', 'Beginner', 50, '8 min', '{"6-9"}', '⚖️', 3),
('4', 'Making My Money Grow', 'Simple ways to help your money grow bigger over time', 'Investing', 'Beginner', 70, '10 min', '{"6-9"}', '📈', 4),
('5', 'Planning My Money', 'Learn how to plan what to do with your money', 'Budgeting', 'Beginner', 60, '10 min', '{"6-9"}', '📊', 4),
('6', 'How Money Can Grow', 'Learn how your money can grow bigger when you save it', 'Saving', 'Beginner', 70, '10 min', '{"6-9"}', '🌱', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert missions
INSERT INTO missions (id, title, description, reward, difficulty, category, due_date_template) VALUES
('1', 'Tidy Up Your Room', 'Put your toys away and make your bed', 15, 'Easy', 'Household', NULL),
('2', 'Help Clear the Table', 'Help put dishes in the sink after eating', 10, 'Easy', 'Kitchen', NULL),
('3', 'Put Toys Away', 'Put all your toys back where they belong', 10, 'Easy', 'Household', NULL),
('4', 'Feed Your Pet', 'Give your pet food and fresh water', 20, 'Medium', 'Pet Care', '2024-02-15'),
('5', 'Put Books Away', 'Put your books back on the shelf nicely', 15, 'Medium', 'Household', NULL),
('6', 'Help Set the Table', 'Help put plates and cups on the table for dinner', 15, 'Easy', 'Household', NULL),
('7', 'Water the Plants', 'Help water the plants in the garden', 25, 'Medium', 'Garden', NULL),
('8', 'Sort Your Clothes', 'Put clean clothes in the right drawers', 20, 'Medium', 'Household', NULL),
('9', 'Help with Groceries', 'Help carry grocery bags from the car', 30, 'Hard', 'Household', NULL),
('10', 'Organize Your Backpack', 'Make sure your school supplies are organized', 15, 'Easy', 'Household', NULL)
ON CONFLICT (id) DO NOTHING;