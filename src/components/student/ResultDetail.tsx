import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as studentApi from '@/api/student.api';
import { formatDate } from '@/utils/formatters';

export const ResultDetail: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (examId) {
      fetchResult();
    }
  }, [examId]);

  const fetchResult = async () => {
    try {
      const response = await studentApi.getMyResultByExam(examId!);
      setResult(response.data);
    } catch (error) {
      console.error('Failed to fetch result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!result) return <div>Result not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{result.examName}</h1>
        <p className="text-gray-600">
          Published on: {formatDate(result.publishedAt, 'PPp')}
        </p>
      </div>

      <Card title="Subject-wise Marks">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Marks Obtained</th>
                <th className="px-4 py-2 text-left">Maximum Marks</th>
                <th className="px-4 py-2 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {result.subjects.map((subject: any, index: number) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{subject.subject}</td>
                  <td className="px-4 py-2">{subject.marksObtained}</td>
                  <td className="px-4 py-2">{subject.maxMarks}</td>
                  <td className="px-4 py-2">
                    {((subject.marksObtained / subject.maxMarks) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td className="px-4 py-2">Total</td>
                <td className="px-4 py-2">{result.totalObtained}</td>
                <td className="px-4 py-2">{result.totalMax}</td>
                <td className="px-4 py-2 text-green-600">{result.percentage}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};