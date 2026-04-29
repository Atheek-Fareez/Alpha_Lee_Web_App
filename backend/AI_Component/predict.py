import sys
import joblib
import pandas as pd
import warnings
import os 

# 1. SILENCE WARNINGS
warnings.filterwarnings("ignore")

def run_prediction():
    try:
        # 2. THE SELF-FINDING LOGIC (Do not change this!)
        # This line automatically finds the folder where this script lives
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        
        # This combines the folder path with your .pkl files
        model_path = os.path.join(BASE_DIR, 'gym_brain.pkl')
        encoder_path = os.path.join(BASE_DIR, 'workout_encoder.pkl')

        # 3. LOAD ASSETS
        model = joblib.load(model_path)
        encoder = joblib.load(encoder_path)

        # 4. RECEIVE ARGUMENTS FROM NODE.JS
        current_w = float(sys.argv[1])
        target_w = float(sys.argv[2])
        duration = float(sys.argv[3])
        workout_type = sys.argv[4]

        # 5. AI CALCULATION
        type_num = encoder.transform([workout_type])[0]
        input_df = pd.DataFrame([[current_w, duration, type_num]], 
                                columns=['Current_Weight', 'Session_Duration', 'Workout_Type_Num'])
        
        workout_burn = model.predict(input_df)[0]

        # 6. GOAL MATH (1kg = 7700 kcal / 30 days)
        weight_diff = current_w - target_w
        daily_goal_offset = (abs(weight_diff) * 7700) / 30

        if weight_diff > 0:
            goal_label = "Loss"
        elif weight_diff < 0:
            goal_label = "Gain"
        else:
            goal_label = "Maintain"

        # 7. FINAL OUTPUT FOR NODE.JS
        print(f"{goal_label},{round(daily_goal_offset, 2)},{round(workout_burn, 2)}")

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    run_prediction()