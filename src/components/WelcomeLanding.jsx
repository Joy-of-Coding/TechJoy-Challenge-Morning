import React from "react";
import { Link } from "react-router-dom";
import MosaicReveal from "./MosaicReveal";
import codingImage from "../assets/codingImage.jpg";
import healthImage from "../assets/Health.jpg";
import mentalImage from "../assets/mental.jpg";

const WelcomeLanding = () => {
  return (
    <div className="min-h-screen font-montserrat">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🐝</div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Welcome to Habit Hive
          </h1>
          <p className="text-xl text-yellow-200 mb-8 max-w-3xl mx-auto">
            Transform your daily routines into a beautiful mosaic of progress.
            Track your habits, build consistency, and watch your goals come to
            life.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Link
              to="/coding"
              className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Start Tracking
            </Link>
            {/* <Link
              to="/"
              className="px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
            >
              View Dashboard
            </Link> */}
          </div>
        </div>

        {/* What is Habit Hive Section */}
        <div className="bg-black/50 border-2 border-yellow-400 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
            What is Habit Hive?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-yellow-200 mb-4">
                Habit Hive is your personal habit tracking sanctuary where every
                action you take reveals a piece of a beautiful mosaic. Think of
                it as building your own digital beehive - each habit you
                complete adds another honeycomb cell to your progress.
              </p>
              <p className="text-lg text-yellow-200 mb-4">
                Our unique MosaicReveal system transforms your daily routines
                into visual art. As you complete your habits, squares in your
                personal mosaic gradually reveal stunning images, making
                progress tracking both motivating and beautiful.
              </p>
              <p className="text-lg text-yellow-200">
                Track three key areas of your life: Coding, Physical Health, and
                Mental Health. Each category has its own mosaic that fills up as
                you reach your weekly goals.
              </p>
            </div>
            <div className="flex justify-center">
              <MosaicReveal
                imageSrc={codingImage}
                filledSquares={3}
                gridSize={4}
              />
            </div>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">
            Your Habit Categories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Coding Category */}
            <div className="bg-black/50 border-2 border-yellow-400 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                Coding
              </h3>
              <p className="text-yellow-200 mb-4">
                Track your programming sessions and watch your skills grow. Log
                hours spent coding, debugging, or learning new technologies.
              </p>
              <div className="text-sm text-yellow-300 mb-4">
                <strong>Goal:</strong> 16 sessions per week
              </div>
              <div className="w-24 h-24 mx-auto mb-4">
                <MosaicReveal
                  imageSrc={codingImage}
                  filledSquares={2}
                  gridSize={4}
                />
              </div>
              <Link
                to="/coding"
                className="inline-block px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300 transition-colors"
              >
                Start Coding
              </Link>
            </div>

            {/* Physical Health Category */}
            <div className="bg-black/50 border-2 border-yellow-400 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                Physical Health
              </h3>
              <p className="text-yellow-200 mb-4">
                Monitor your fitness journey and physical activities. From
                workouts to walks, every movement counts toward your health
                goals.
              </p>
              <div className="text-sm text-yellow-300 mb-4">
                <strong>Goal:</strong> 16 activities per week
              </div>
              <div className="w-24 h-24 mx-auto mb-4">
                <MosaicReveal
                  imageSrc={healthImage}
                  filledSquares={1}
                  gridSize={4}
                />
              </div>
              <Link
                to="/physical"
                className="inline-block px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300 transition-colors"
              >
                Track Fitness
              </Link>
            </div>

            {/* Mental Health Category */}
            <div className="bg-black/50 border-2 border-yellow-400 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">
                Mental Health
              </h3>
              <p className="text-yellow-200 mb-4">
                Nurture your mind and emotional well-being. Track meditation,
                journaling, therapy sessions, or any self-care activities.
              </p>
              <div className="text-sm text-yellow-300 mb-4">
                <strong>Goal:</strong> 16 activities per week
              </div>
              <div className="w-24 h-24 mx-auto mb-4">
                <MosaicReveal
                  imageSrc={mentalImage}
                  filledSquares={1}
                  gridSize={4}
                />
              </div>
              <Link
                to="/mental"
                className="inline-block px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300 transition-colors"
              >
                Mind Matters
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-black/50 border-2 border-yellow-400 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2 text-yellow-400">
                1. Log Your Activities
              </h3>
              <p className="text-yellow-200">
                Visit any category page and log your daily activities. Each
                entry gets timestamped and stored securely.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2 text-yellow-400">
                2. Watch Progress Unfold
              </h3>
              <p className="text-yellow-200">
                As you complete activities, squares in your mosaic gradually
                reveal beautiful images. See your progress come to life!
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2 text-yellow-400">
                3. Achieve Your Goals
              </h3>
              <p className="text-yellow-200">
                Reach your weekly goals and complete your mosaics. Celebrate
                your consistency and build lasting habits.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">
            Ready to Build Your Hive?
          </h2>
          <p className="text-lg text-yellow-200 mb-6">
            Start your habit tracking journey today and watch your progress
            blossom into something beautiful.
          </p>
          <Link
            to="/coding"
            className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold text-lg rounded-lg hover:from-yellow-300 hover:to-yellow-200 transition-all shadow-lg"
          >
            🐝 Begin Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLanding;
