import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Image } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImage } from '@/lib/api';

const SkinAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
    e.currentTarget.classList.remove('border-dashed');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    e.currentTarget.classList.add('border-dashed');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    e.currentTarget.classList.add('border-dashed');
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewUrl(imageUrl);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    try {
      const result = await uploadImage(selectedImage);
      setPredictionResult(result);
      setShowResult(true);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <section id="prediction" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Upload Skin Image
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left side - Image Upload */}
          <Card className="w-full lg:w-1/2 overflow-hidden">
            <CardContent className="p-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center min-h-[300px] flex flex-col items-center justify-center cursor-pointer transition-all ${previewUrl ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={previewUrl} 
                      alt="Skin condition preview" 
                      className="max-h-48 rounded-lg shadow-md mb-4" 
                    />
                    <p className="text-sm text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-100 rounded-full p-4 mb-4">
                      <Upload className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-lg font-medium mb-2">Drag & Drop your image here</p>
                    <p className="text-sm text-gray-500">or click to browse files</p>
                  </>
                )}
                <input 
                  type="file" 
                  id="file-input" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload} 
                />
              </div>
              
              <Button 
                className="w-full mt-4 bg-primary hover:bg-primary-dark text-white"
                disabled={!previewUrl || analyzing}
                onClick={handleAnalyze}
              >
                {analyzing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </CardContent>
          </Card>

          {/* Right side - Results */}
          <Card className={`w-full lg:w-1/2 overflow-hidden ${!showResult && 'opacity-70'}`}>
            <CardContent className="p-6">
              {!showResult ? (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-400">
                  <Image className="h-16 w-16 mb-4 opacity-30" />
                  <p className="text-lg font-medium">Results will appear here</p>
                  <p className="text-sm">Upload and analyze an image to see the prediction</p>
                </div>
              ) : predictionResult && (
                <div className="animate-fade-in">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Prediction Result</h3>
                  
                  <div className="mb-6">
                    <p className="text-lg mb-2">
                      The model predicts: <span className="font-semibold text-primary">{predictionResult.prediction}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Confidence: {(predictionResult.confidence * 100).toFixed(2)}%
                    </p>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="flex items-center text-primary font-semibold mb-2">
                        <span className="bg-blue-100 rounded-full p-1 mr-2">📋</span> Description
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {predictionResult.disease_data.description}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="flex items-center text-primary font-semibold mb-2">
                        <span className="bg-blue-100 rounded-full p-1 mr-2">🔍</span> Causes
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {predictionResult.disease_data.causes}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="flex items-center text-primary font-semibold mb-2">
                        <span className="bg-blue-100 rounded-full p-1 mr-2">🛡️</span> Prevention
                      </h4>
                      <ul className="text-gray-700 space-y-2">
                        {predictionResult.disease_data.prevention.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="flex items-center text-primary font-semibold mb-2">
                        <span className="bg-blue-100 rounded-full p-1 mr-2">💊</span> Treatment Options
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {predictionResult.disease_data.treatment}
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6 bg-primary hover:bg-primary-dark text-white">
                    Book Appointment with Specialist
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SkinAnalysis;
