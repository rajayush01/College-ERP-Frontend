// import React, { useEffect, useState } from 'react';
// import { Card } from '../common/Card';
// import { LoadingSpinner } from '../common/LoadingSpinner';
// import * as teacherApi from '@/api/teacher.api';
// import { formatDate } from '@/utils/formatters';
// import {
//   User,
//   Mail,
//   Calendar,
//   Droplet,
//   Heart,
//   GraduationCap,
//   Phone,
//   MapPin,
//   FileText
// } from 'lucide-react';

// export const TeacherProfile: React.FC = () => {
//   const [profile, setProfile] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await teacherApi.getMyProfile();
//         setProfile(response.data.teacher);
//       } catch (error) {
//         console.error('Failed to fetch profile:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) return <LoadingSpinner />;
//   if (!profile) return <div>Profile not found</div>;

//   const { address } = profile;

//   return (
//     <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-indigo-50 to-purple-50 min-h-screen">
//       {/* Header */}
//       <div className="animate-slide-up">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//           My Profile
//         </h1>
//         <p className="text-neutral-600">View your personal information</p>
//       </div>

//       {/* Personal Info */}
//       <Card title="Personal Information" className="shadow-lg">
//         <div className="grid md:grid-cols-2 gap-6">

//           <Info label="Teacher ID" value={profile.teacherId} icon={<User />} />
//           <Info label="Name" value={profile.name} icon={<User />} />
//           <Info label="Email" value={profile.email} icon={<Mail />} />
//           <Info label="Blood Group" value={profile.bloodGroup} icon={<Droplet />} />
//           <Info label="Marital Status" value={profile.maritalStatus} icon={<Heart />} />
//           <Info label="DOB" value={formatDate(profile.dob)} icon={<Calendar />} />
//           <Info label="Joined Date" value={formatDate(profile.joinedDate)} icon={<Calendar />} />

//           {/* Phone Numbers */}
//           <div className="p-4 bg-blue-50 rounded-xl border">
//             <div className="flex items-center gap-2 mb-2">
//               <Phone size={18} />
//               <label className="font-semibold">Phone Numbers</label>
//             </div>
//             {profile.phoneNumbers?.map((p: any, i: number) => (
//               <p key={i} className="text-neutral-800">
//                 <strong>{p.label}:</strong> {p.number}
//               </p>
//             ))}
//           </div>

//           {/* Address */}
//           <div className="md:col-span-2 p-4 bg-neutral-50 rounded-xl border">
//             <div className="flex items-center gap-2 mb-2">
//               <MapPin size={18} />
//               <label className="font-semibold">Address</label>
//             </div>
//             <p>{address.street}</p>
//             <p>{address.city}, {address.state}</p>
//             <p>PIN: {address.pincode}</p>
//           </div>
//         </div>
//       </Card>

//       {/* Qualifications */}
//       {profile.qualifications?.length > 0 && (
//         <Card title="Qualifications">
//           <div className="grid md:grid-cols-2 gap-4">
//             {profile.qualifications.map((q: any, i: number) => (
//               <div key={i} className="p-4 bg-indigo-50 rounded-xl border">
//                 <div className="flex items-center gap-2 mb-2">
//                   <GraduationCap size={20} />
//                   <h3 className="font-bold">{q.degree}</h3>
//                 </div>
//                 <p><strong>Institution:</strong> {q.institution}</p>
//                 <p><strong>Year:</strong> {q.year}</p>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* Documents */}
//       {profile.documents?.length > 0 && (
//         <Card title="Documents">
//           <div className="space-y-3">
//             {profile.documents.map((doc: any, i: number) => (
//               <a
//                 key={i}
//                 href={doc.fileUrl}
//                 target="_blank"
//                 className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100"
//               >
//                 <FileText size={18} />
//                 <span>{doc.title}</span>
//               </a>
//             ))}
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };

// /* Reusable info block */
// const Info = ({
//   label,
//   value,
//   icon
// }: {
//   label: string;
//   value: any;
//   icon: React.ReactNode;
// }) => (
//   <div className="p-4 bg-white rounded-xl border">
//     <div className="flex items-center gap-2 mb-1">
//       {icon}
//       <label className="font-semibold">{label}</label>
//     </div>
//     <p className="text-neutral-800">{value}</p>
//   </div>
// );


import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { formatDate } from '@/utils/formatters';
import {
  User,
  Mail,
  Calendar,
  Droplet,
  Heart,
  GraduationCap,
  Phone,
  MapPin,
  FileText,
  Users,
  Cake
} from 'lucide-react';

export const TeacherProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await teacherApi.getMyProfile();
        setProfile(response.data.teacher);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div>Profile not found</div>;

  const { address } = profile;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {profile.image && (
          <img
            src={profile.image}
            alt="Teacher"
            className="w-24 h-24 rounded-full object-cover border-4 border-primary-600 shadow-xl"
          />
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
            My Profile
          </h1>
          <p className="text-secondary-700 font-semibold">
            View your personal information
          </p>
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <Card title="Personal Information" className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Info label="Faculty ID" value={profile.teacherId} icon={<User />} />
          <Info label="Name" value={profile.name} icon={<User />} />
          <Info label="Email" value={profile.email} icon={<Mail />} />
          <Info
  label="Father's Name"
  value={profile.fatherName || '—'}
  icon={<Users />}
/>

<Info
  label="Mother's Name"
  value={profile.motherName || '—'}
  icon={<Users />}
/>


          <Info label="Blood Group" value={profile.bloodGroup || '—'} icon={<Droplet />} />
          <Info label="Marital Status" value={profile.maritalStatus || '—'} icon={<Heart />} />

          <Info label="Partner Name" value={profile.partnerName || '—'} icon={<Heart />} />
          <Info label="Age" value={profile.age ? `${profile.age} years` : '—'} icon={<Cake />} />

          <Info label="DOB" value={formatDate(profile.dob)} icon={<Calendar />} />
          <Info label="Joined Date" value={formatDate(profile.joinedDate)} icon={<Calendar />} />

          {/* PHONE NUMBERS */}
          <div className="p-4 bg-primary-50 rounded-lg border-2 border-primary-300">
            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} className="text-primary-700" />
              <label className="font-bold text-secondary-900">Phone Numbers</label>
            </div>
            {profile.phoneNumbers?.map((p: any, i: number) => (
              <p key={i} className="text-secondary-800 font-medium text-sm">
                <strong className="capitalize">{p.label}:</strong> {p.number}
              </p>
            ))}
          </div>

          {/* ADDRESS */}
          <div className="md:col-span-2 p-4 bg-secondary-50 rounded-lg border-2 border-secondary-300">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-secondary-700" />
              <label className="font-bold text-secondary-900">Address</label>
            </div>
            <p className="text-sm font-medium text-secondary-800">{address?.street}</p>
            <p className="text-sm font-medium text-secondary-800">
              {address?.city}, {address?.state}
            </p>
            <p className="text-sm font-medium text-secondary-800">PIN: {address?.pincode}</p>
          </div>
        </div>
      </Card>

      {/* QUALIFICATIONS */}
      {profile.qualifications?.length > 0 && (
        <Card title="Qualifications" className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.qualifications.map((q: any, i: number) => (
              <div key={i} className="p-4 bg-primary-50 rounded-lg border-2 border-primary-300">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap size={20} className="text-primary-700" />
                  <h3 className="font-bold text-secondary-900">{q.degree}</h3>
                </div>
                <p className="text-sm font-semibold text-secondary-800">
                  <strong>Institution:</strong> {q.institution}
                </p>
                <p className="text-sm font-semibold text-secondary-800">
                  <strong>Year:</strong> {q.year}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* DOCUMENTS */}
      {profile.documents?.length > 0 && (
        <Card title="Documents" className="shadow-xl border-2 border-secondary-300 border-l-4 border-l-primary-600">
          <div className="space-y-3">
            {profile.documents.map((doc: any, i: number) => (
              <a
                key={i}
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg border-2 border-secondary-300 hover:bg-primary-50 hover:border-primary-600 transition-all duration-200"
              >
                <FileText size={18} className="text-primary-700" />
                <div>
                  <p className="font-bold text-sm text-secondary-900">{doc.title}</p>
                  <p className="text-xs text-secondary-600 font-medium">
                    Uploaded on {formatDate(doc.uploadedAt, 'PP')}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

/* REUSABLE INFO BLOCK */
const Info = ({
  label,
  value,
  icon
}: {
  label: string;
  value: any;
  icon: React.ReactNode;
}) => (
  <div className="p-4 bg-white rounded-lg border-2 border-secondary-300 hover:border-primary-600 transition-all duration-200">
    <div className="flex items-center gap-2 mb-1 text-sm">
      <span className="text-primary-700">{icon}</span>
      <label className="font-bold text-secondary-800">{label}</label>
    </div>
    <p className="text-secondary-900 font-medium text-sm">{value}</p>
  </div>
);
