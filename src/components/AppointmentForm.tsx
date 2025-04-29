import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { toast } from 'sonner';
import { Calendar, Upload } from 'lucide-react';
import { uploadImageAndGetUrl } from "@/lib/imageUpload";

const AppointmentForm = () => {
  // State for each field
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [doctor, setDoctor] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [image, setImage] = useState<File | null>(null);

  // Map doctor value to name
  const doctorOptions: Record<string, string> = {
    "dr-smith": "Dr. Smith",
    "dr-johnson": "Dr. Johnson",
    "dr-williams": "Dr. Williams",
    "dr-brown": "Dr. Brown"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = '';
    if (image) {
      try {
        imageUrl = await uploadImageAndGetUrl(image);
      } catch (err) {
        // Optionally handle upload error
        // toast.error("Image upload failed");
      }
    }

    const formData: any = {
      full_name: fullName,
      email,
      phone_number: phone,
      doctor_id: doctor,
      doctor_name: doctorOptions[doctor] || '',
      preferred_date: date,
      preferred_time: time,
      symptoms,
      image_url: imageUrl,
    };

    try {
      await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (err) {
      // Optionally log error
    }

    toast.success("Appointment request submitted successfully!", {
      description: "We'll contact you shortly to confirm your appointment."
    });
  };

  return (
    <section id="appointment" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Book an Appointment</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Schedule a consultation with our dermatology specialists for personalized care and treatment plans.
        </p>
        
        <Card className="overflow-hidden shadow-lg border-gray-100 max-w-4xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="text-primary" />
              <span>Consultation Request</span>
            </CardTitle>
            <CardDescription>
              Fill out the form below and our team will get back to you within 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input 
                    id="fullName" 
                    placeholder="Enter your full name" 
                    required 
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    required 
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    required 
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Doctor *
                  </label>
                  <select 
                    id="doctor" 
                    required 
                    value={doctor}
                    onChange={e => setDoctor(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="" disabled>Choose a specialist</option>
                    <option value="dr-smith">Dr. Smith - General Dermatology</option>
                    <option value="dr-johnson">Dr. Johnson - Pediatric Dermatology</option>
                    <option value="dr-williams">Dr. Williams - Cosmetic Dermatology</option>
                    <option value="dr-brown">Dr. Brown - Surgical Dermatology</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date *
                  </label>
                  <Input 
                    id="date" 
                    type="date" 
                    required 
                    className="border-gray-300 focus:border-primary focus:ring-primary"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time *
                  </label>
                  <select 
                    id="time" 
                    required 
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="" disabled>Select time slot</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                  Describe Your Symptoms
                </label>
                <Textarea 
                  id="symptoms" 
                  placeholder="Please describe your skin condition and symptoms" 
                  rows={4}
                  className="border-gray-300 focus:border-primary focus:ring-primary resize-none"
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              setImage(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 mt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark text-white py-2.5"
                >
                  Book Appointment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AppointmentForm;
