import Exercise from '../Models/Exercise.js';

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Private/Admin
export const getExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find({});
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create an exercise
// @route   POST /api/exercises
// @access  Private/Admin
export const createExercise = async (req, res) => {
    try {
        const { name, videoUrl, muscleGroup, equipment } = req.body;
        const exercise = new Exercise({
            name, videoUrl, muscleGroup, equipment
        });
        const createdExercise = await exercise.save();
        res.status(201).json(createdExercise);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Delete an exercise
// @route   DELETE /api/exercises/:id
// @access  Private/Admin
export const deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (exercise) {
            await exercise.deleteOne();
            res.json({ message: 'Exercise removed' });
        } else {
            res.status(404).json({ message: 'Exercise not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
