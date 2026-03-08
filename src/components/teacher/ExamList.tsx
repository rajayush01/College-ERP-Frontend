// import React, { useEffect, useState } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { Table } from '../common/Table';
// import { LoadingSpinner } from '../common/LoadingSpinner';
// import * as teacherApi from '@/api/teacher.api';
// import { useNavigate } from 'react-router-dom';
// import { formatDate } from '@/utils/formatters';
// import { ClipboardList, BookOpen } from 'lucide-react';

// export const ExamList: React.FC = () => {
//   const navigate = useNavigate();
//   const [exams, setExams] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchExams();
//   }, []);

//   const fetchExams = async () => {
//     try {
//       const res = await teacherApi.getMyExams();
//       setExams(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error('Failed to fetch exams:', err);
//       setExams([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       key: 'name',
//       header: 'Exam Name',
//       render: (name: string) => (
//         <span className="font-semibold text-neutral-800">{name}</span>
//       ),
//     },

//     {
//       key: 'classes',
//       header: 'Classes',
//       render: (classes: any[] | undefined) =>
//         Array.isArray(classes) && classes.length ? (
//           <div className="flex flex-wrap gap-2">
//             {classes.map((c) => (
//               <span
//                 key={c._id}
//                 className="px-2 py-1 text-xs font-bold rounded-lg bg-violet-100 text-violet-700 border border-violet-200"
//               >
//                 {c.name} - {c.section}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <span className="text-neutral-400 text-sm">—</span>
//         ),
//     },

//     {
//       key: 'subjects',
//       header: 'My Subjects',
//       render: (subjects: any[] | undefined) =>
//         Array.isArray(subjects) && subjects.length ? (
//           <span className="text-sm text-neutral-700">
//             {subjects.map((s) => s.subject).join(', ')}
//           </span>
//         ) : (
//           <span className="text-neutral-400 text-sm">—</span>
//         ),
//     },

//     {
//       key: 'status',
//       header: 'Status',
//       render: (status: string) => {
//         const styles: Record<string, string> = {
//           CREATED: 'bg-blue-100 text-blue-800',
//           EVALUATED: 'bg-amber-100 text-amber-800',
//           PUBLISHED: 'bg-emerald-100 text-emerald-800',
//         };

//         return (
//           <span
//             className={`px-3 py-1 rounded-lg text-xs font-bold ${
//               styles[status] || 'bg-neutral-100 text-neutral-700'
//             }`}
//           >
//             {status}
//           </span>
//         );
//       },
//     },

//     {
//       key: 'publishedAt',
//       header: 'Published',
//       render: (date: string | null) =>
//         date ? (
//           formatDate(date, 'PP')
//         ) : (
//           <span className="text-neutral-400">—</span>
//         ),
//     },

//     {
//       key: 'actions',
//       header: 'Actions',
//       render: (_: any, row: any) => (
//         <Button
//           variant="secondary"
//           disabled={row.status === 'PUBLISHED' || !row._id}
//           onClick={() =>
//             row._id &&
//             navigate('/teacher/marks', {
//               state: { examId: row._id },
//             })
//           }
//         >
//           Enter Marks
//         </Button>
//       ),
//     },
//   ];

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-violet-50 to-purple-50 min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center animate-slide-up">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
//             My Exams
//           </h1>
//           <p className="text-neutral-600">
//             Manage exams and enter marks for your subjects
//           </p>
//         </div>

//         <div className="flex items-center gap-3 px-4 py-2 bg-violet-100 rounded-xl border-2 border-violet-200">
//           <ClipboardList size={24} className="text-violet-600" />
//           <span className="font-bold text-violet-700">
//             {exams.length} Exams
//           </span>
//         </div>
//       </div>

//       {/* TABLE */}
//       <Card className="animate-slide-up shadow-lg border-2 border-white">
//         {exams.length === 0 ? (
//           <div className="text-center py-14">
//             <BookOpen size={48} className="mx-auto mb-4 text-violet-400" />
//             <p className="text-neutral-500">No exams assigned yet</p>
//           </div>
//         ) : (
//           <Table columns={columns} data={exams} />
//         )}
//       </Card>
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Table } from '../common/Table';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as teacherApi from '@/api/teacher.api';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/formatters';
import { ClipboardList, BookOpen } from 'lucide-react';

export const ExamList: React.FC = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await teacherApi.getMyExams();
      setExams(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch exams:', err);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CREATED: 'bg-blue-100 text-blue-800',
      EVALUATED: 'bg-amber-100 text-amber-800',
      PUBLISHED: 'bg-emerald-100 text-emerald-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-lg text-xs font-bold ${
          styles[status] || 'bg-neutral-100 text-neutral-700'
        }`}
      >
        {status}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      header: 'Exam Name',
      render: (name: string) => (
        <span className="font-semibold text-neutral-800">{name}</span>
      ),
    },
    {
      key: 'batches',
      header: 'Batches',
      render: (batches: any[] | undefined) =>
        Array.isArray(batches) && batches.length ? (
          <div className="flex flex-wrap gap-2">
            {batches.map((b) => (
              <span
                key={b._id}
                className="px-2 py-1 text-xs font-bold rounded-lg bg-violet-100 text-violet-700 border border-violet-200"
              >
                {b.batchName}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-neutral-400 text-sm">—</span>
        ),
    },
    {
      key: 'subjects',
      header: 'My Subjects',
      render: (subjects: any[] | undefined) =>
        Array.isArray(subjects) && subjects.length ? (
          <span className="text-sm text-neutral-700">
            {subjects.map((s) => s.subject).join(', ')}
          </span>
        ) : (
          <span className="text-neutral-400 text-sm">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: getStatusBadge,
    },
    {
      key: 'publishedAt',
      header: 'Published',
      render: (date: string | null) =>
        date ? formatDate(date, 'PP') : <span className="text-neutral-400">—</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, row: any) => (
        <Button
          variant="secondary"
          disabled={row.status === 'PUBLISHED' || !row._id}
          onClick={() =>
            row._id &&
            navigate('/teacher/marks', {
              state: { examId: row._id },
            })
          }
        >
          Enter Marks
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-neutral-50 via-violet-50 to-purple-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            My Exams
          </h1>
          <p className="text-neutral-600">
            Manage exams and enter marks for your subjects
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-violet-100 rounded-xl border border-violet-200 w-fit">
          <ClipboardList size={22} className="text-violet-600" />
          <span className="font-bold text-violet-700">
            {exams.length} Exams
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <Card className="shadow-lg border border-white">
        {exams.length === 0 ? (
          <div className="text-center py-14">
            <BookOpen size={48} className="mx-auto mb-4 text-violet-400" />
            <p className="text-neutral-500">No exams assigned yet</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table columns={columns} data={exams} mobileCardView={true}/>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {exams.map((exam) => (
                <Card key={exam._id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{exam.name}</h3>
                    {getStatusBadge(exam.status)}
                  </div>

                  {/* Batches */}
                  {exam.batches?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exam.batches.map((b: any) => (
                        <span
                          key={b._id}
                          className="px-2 py-1 text-xs font-bold rounded bg-violet-100 text-violet-700"
                        >
                          {b.batchName}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Subjects */}
                  {exam.subjects?.length > 0 && (
                    <p className="text-sm text-neutral-700">
                      <strong>Subjects:</strong>{' '}
                      {exam.subjects.map((s: any) => s.subject).join(', ')}
                    </p>
                  )}

                  {/* Published */}
                  <p className="text-xs text-neutral-500">
                    Published:{' '}
                    {exam.publishedAt
                      ? formatDate(exam.publishedAt, 'PP')
                      : '—'}
                  </p>

                  {/* Action */}
                  <Button
                    className="w-full"
                    variant="secondary"
                    disabled={exam.status === 'PUBLISHED'}
                    onClick={() =>
                      navigate('/teacher/marks', {
                        state: { examId: exam._id },
                      })
                    }
                  >
                    Enter Marks
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
