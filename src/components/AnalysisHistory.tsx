import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Analysis } from '@/lib/supabase';

const AnalysisHistory = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      toast.error('Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analysis History</h2>
      {analyses.length === 0 ? (
        <p className="text-gray-500">No analyses found. Upload an image to get started!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis) => (
            <Card key={analysis.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {analysis.prediction}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <img
                    src={analysis.image_url}
                    alt="Skin condition"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Confidence: {(analysis.confidence * 100).toFixed(2)}%
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {analysis.disease_data && (
                    <div className="mt-4 space-y-2">
                      <h3 className="font-medium">Details</h3>
                      <p className="text-sm text-gray-600">
                        {analysis.disease_data.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory; 