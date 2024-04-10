from flask import Flask, render_template, request, jsonify
from supabase import create_client, Client
import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()
app = Flask(__name__)

# Initialize Supabase client
url:str = "https://xjbdjsqthtufqezfrugy.supabase.co"
key:str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYmRqc3F0aHR1ZnFlemZydWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2Njg0MjgsImV4cCI6MjAyODI0NDQyOH0.B3ABkV7qpQJ9M3w5GujJ3lxr-kUyaBKb1mHUpXw3np8"
supabase: Client = create_client(url, key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/read_rfid', methods=['GET'])
def read_rfid():
    try:
        rfid, text = reader.read()
        return jsonify({"rfid": rfid})
    except:
        GPIO.cleanup()
        print('GPIO Good to Go')

@app.route('/scan', methods=['POST'])
def scan():
    # Get the RFID value from the request
    rfid = request.form.get('rfid')

    if rfid:
        # Search for the student in the University table
        student = supabase.table("University").select("*").eq("Stu_RFID", rfid).execute()

        if student.data:
            # Student found, return student details
            return jsonify(student.data[0])
        else:
            return jsonify({"error": "Student not found"}), 404
    else:
        return jsonify({"error": "No RFID provided"}), 400
    
@app.route('/check_in_gym', methods=['POST'])
def check_in_gym():
    # Get the RFID value from the request
    rfid = request.form.get('rfid')

    if rfid:
        # Search for the student in the University table
        student = supabase.table("University").select("*").eq("Stu_RFID", rfid).execute()

        if student.data:
            # Student found, check if they have a booking in the GymWaiting table
            booking = supabase.table("GymWaiting").select("*").eq("RFID", rfid).eq("status", False).execute()

            if booking.data:
                # Booking found, update the status to active
                supabase.table("GymWaiting").update({"status": True}).eq("RFID", rfid).execute()

                # Return the booking details
                return jsonify(booking.data[0])
            else:
                return jsonify({"error": "No booking found"}), 404
        else:
            return jsonify({"error": "Student not found"}), 404
    else:
        return jsonify({"error": "No RFID provided"}), 400

@app.route('/check_out_gym', methods=['POST'])
def check_out_gym():
    # Get the RFID value from the request
    rfid = request.form.get('rfid')

    if rfid:
        # Search for an active booking in the GymWaiting table
        booking = supabase.table("GymWaiting").select("*").eq("RFID", rfid).eq("status", True).execute()

        if booking.data:
            # Get time and location from the GymWaiting table
            time = booking.data[0]['time']
            location = booking.data[0]['location']

            # Update GymDB table
            available_slots = supabase.table("GymDB").select("available_slots").eq("time", time).eq("location", location).execute().data[0]['available_slots']
            maximum_slots = supabase.table("GymDB").select("maximum_slots").eq("time", time).eq("location", location).execute().data[0]['maximum_slots']

            if available_slots < maximum_slots:
                supabase.table("GymDB").update({"available_slots": available_slots + 1}, returning='*').eq("time", time).eq("location", location).execute()
            else:
                return jsonify({"error": "Maximum slots reached for this time and location"}), 400

            # Booking found, delete the entry from the GymWaiting table
            supabase.table("GymWaiting").delete().eq("RFID", rfid).eq("status", True).execute()
            return jsonify({"message": "Gym check-out successful"})
        else:
            return jsonify({"error": "No active booking found"}), 404
    else:
        return jsonify({"error": "No RFID provided"}), 400
    
@app.route('/check_in_sport', methods=['POST'])
def check_in_sport():
    # Get the RFID value from the request
    rfid = request.form.get('rfid')

    if rfid:
        # Search for the student in the University table
        student = supabase.table("University").select("*").eq("Stu_RFID", rfid).execute()

        if student.data:
            # Student found, check if they have a booking in the SportsWaiting table
            booking = supabase.table("SportsWaiting").select("*").eq("RFID", rfid).eq("status", False).execute()

            if booking.data:
                # Booking found, update the status to active
                supabase.table("SportsWaiting").update({"status": True}).eq("RFID", rfid).eq("status", False).execute()

                # Return the booking details
                return jsonify(booking.data[0])
            else:
                return jsonify({"error": "No booking found"}), 404
        else:
            return jsonify({"error": "Student not found"}), 404
    else:
        return jsonify({"error": "No RFID provided"}), 400
    
@app.route('/issue_equipment', methods=['POST'])
def issue_equipment():
    # Get the user's RFID and the equipment RFID from the request
    user_rfid = request.form.get('user_rfid')
    equipment_rfid = request.form.get('equipment_rfid')

    if user_rfid and equipment_rfid:
        # Search for the equipment in the Equipment table
        equipment = supabase.table("Equipment").select("*").eq("EquipmentRFID", equipment_rfid).execute()

        if equipment.data:
            # Update the equipment status and the last issue RFID
            supabase.table("Equipment").update({"Status": "Issued", "LastIssueRFID": user_rfid}).eq("EquipmentRFID", equipment_rfid).execute()

            # Return the equipment name
            return jsonify({"name": equipment.data[0]["name"]})
        else:
            return jsonify({"error": "Equipment not found"}), 404
    else:
        return jsonify({"error": "Missing required parameters"}), 400
@app.route('/check_out_sport', methods=['POST'])
def check_out_sport():
    # Get the RFID value from the request
    rfid = request.form.get('rfid')


    if rfid:
        # Search for the active booking in the SportsWaiting table
        booking = supabase.table("SportsWaiting").select("*").eq("RFID", rfid).eq("status", True).execute()

        if booking.data:
            # Booking found, delete the entry from the SportsWaiting table
            supabase.table("SportsWaiting").delete().eq("RFID", rfid).eq("status", True).execute()

            # Return the booking details
            return jsonify(booking.data[0])
        else:
            return jsonify({"error": "No active booking found"}), 404
    else:
        return jsonify({"error": "Missing required parameters"}), 400

@app.route('/return_equipment', methods=['POST'])
def return_equipment():
    # Get the user's RFID, the equipment RFID, and the time slot from the request
    user_rfid = request.form.get('user_rfid')
    equipment_rfid = request.form.get('equipment_rfid')
    slot_time = request.form.get('slot_time')

    if user_rfid and equipment_rfid and slot_time:
        # Search for the equipment in the Equipment table
        equipment = supabase.table("Equipment").select("*").eq("EquipmentRFID", equipment_rfid).execute()

        if equipment.data:
            # Get the equipment name
            equipment_name = equipment.data[0]["name"]

            # Update the equipment status and keep the last issue RFID
            supabase.table("Equipment").update({"Status": "InHouse"}).eq("EquipmentRFID", equipment_rfid).execute()

            # Search for the entry in the Sports table with the composite key (equipment_name, slot_time)
            sports_entry = supabase.table("Sports").select("*").eq("name", equipment_name).eq("time", slot_time).execute()

            if sports_entry.data:
                # Get the current quantity and the maximum quantity
                current_quantity = sports_entry.data[0]["quantity"]
                max_quantity = sports_entry.data[0]["max_quantity"]

                # If the current quantity is less than the maximum quantity, increment the quantity
                if current_quantity < max_quantity:
                    supabase.table("Sports").update({"quantity": current_quantity + 1}).eq("name", equipment_name).eq("time", slot_time).execute()

            # Return the equipment name
            return jsonify({"name": equipment_name})
        else:
            return jsonify({"error": "Equipment not found"}), 404
    else:
        return jsonify({"error": "Missing required parameters"}), 400
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
