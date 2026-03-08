import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as studentApi from '@/api/student.api';
import { formatDate } from '@/utils/formatters';

const calculateAge = (dob: string | Date) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const StudentProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentApi.getMyProfile();
      setProfile(response.data.student);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div>Profile not found</div>;

  const phoneNumbers = profile.phoneNumbers?.flatMap((p: string) => {
    try {
      return JSON.parse(p);
    } catch {
      return p;
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-secondary-900">My Profile</h1>

      {/* Profile Header */}
      <Card className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src={profile.image}
            alt="Student"
            className="w-28 h-28 rounded-full object-cover border-4 border-primary-600 shadow-lg"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-secondary-900">{profile.name}</h2>
            <p className="text-secondary-700 font-semibold">
              Batch: {profile.batchId?.batchName}
            </p>
            <p className="text-sm text-secondary-600 font-medium">Enrollment No: {profile.enrollmentNumber}</p>
            <p className="text-sm text-secondary-600 font-medium">Department: {profile.department}</p>
            <p className="text-sm text-secondary-600 font-medium">Semester: {profile.semester}</p>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card title="Personal Information" className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Student ID" value={profile.studentId} />
          <Info label="Blood Group" value={profile.bloodGroup} />
          <Info label="Caste" value={profile.caste} />
          <Info label="Date of Birth" value={formatDate(profile.dob)} />
          <Info label="Age" value={`${calculateAge(profile.dob)} years`} />
          <Info label="Joined Date" value={formatDate(profile.joinedDate)} />

          <Info label="Father Name" value={profile.fatherName} />
          <Info label="Mother Name" value={profile.motherName} />

          <Info label="Parents Email" value={profile.parentsEmail} />
          <Info label="Student Email" value={profile.studentEmail || '—'} />

          <div className="md:col-span-2">
            <Info label="Contact Numbers" value={phoneNumbers?.join(', ')} />
          </div>

          <div className="md:col-span-2">
            <Info label="Address" value={profile.address} />
          </div>
        </div>
      </Card>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: any }) => (
  <div>
    <p className="text-sm font-bold text-secondary-700">{label}</p>
    <p className="text-secondary-900 font-medium">{value || '—'}</p>
  </div>
);
