// import React, { useEffect, useState } from 'react';
// import { Card } from '../common/Card';
// import { Button } from '../common/Button';
// import { LoadingSpinner } from '../common/LoadingSpinner';
// import * as commonApi from '@/api/common.api';
// import { FileText, Download, FolderOpen } from 'lucide-react';

// export const SharedDocuments: React.FC = () => {
//   const [documents, setDocuments] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       const response = await commonApi.getSharedDocuments();
//       setDocuments(response.data);
//     } catch (error) {
//       console.error('Failed to fetch documents:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="space-y-8 p-6 bg-gradient-to-br from-neutral-50 via-sky-50 to-indigo-50 min-h-screen">

//       {/* HEADER */}
//       <div className="flex justify-between items-center animate-slide-up">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent mb-2">
//             Shared Documents
//           </h1>
//           <p className="text-neutral-600">
//             Documents shared by admin for teachers
//           </p>
//         </div>

//         <div className="flex items-center gap-3 px-4 py-2 bg-indigo-100 rounded-xl border-2 border-indigo-200">
//           <FolderOpen size={24} className="text-indigo-600" />
//           <span className="font-bold text-indigo-700">
//             {documents.length} Files
//           </span>
//         </div>
//       </div>

//       {/* CONTENT */}
//       {documents.length === 0 ? (
//         <Card className="text-center py-14">
//           <FileText size={48} className="mx-auto mb-4 text-indigo-300" />
//           <p className="text-neutral-500">No documents shared yet</p>
//         </Card>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {documents.map((doc) => (
//             <Card
//               key={doc._id}
//               className="shadow-lg border-2 border-white hover:shadow-xl transition-all"
//             >
//               <div className="flex items-start gap-4">
//                 <div className="p-3 bg-indigo-100 rounded-lg">
//                   <FileText size={28} className="text-indigo-600" />
//                 </div>

//                 <div className="flex-1">
//                   <h3 className="font-semibold text-lg text-neutral-800">
//                     {doc.title}
//                   </h3>

//                   {doc.description && (
//                     <p className="text-sm text-neutral-600 mt-1">
//                       {doc.description}
//                     </p>
//                   )}

//                   <p className="text-xs text-neutral-400 mt-2">
//                     Uploaded on{' '}
//                     {new Date(doc.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <Button
//                   variant="secondary"
//                   className="w-full flex items-center justify-center gap-2"
//                   onClick={() => window.open(doc.fileUrl, '_blank')}
//                 >
//                   <Download size={16} />
//                   View / Download
//                 </Button>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import * as commonApi from '@/api/common.api';
import { FileText, Download, FolderOpen } from 'lucide-react';

export const SharedDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await commonApi.getSharedDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-neutral-50 via-sky-50 to-indigo-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent mb-1">
            Shared Documents
          </h1>
          <p className="text-neutral-600">
            Documents shared by admin for teachers
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-100 rounded-xl border border-indigo-200 w-fit">
          <FolderOpen size={22} className="text-indigo-600" />
          <span className="font-bold text-indigo-700">
            {documents.length} Files
          </span>
        </div>
      </div>

      {/* CONTENT */}
      {documents.length === 0 ? (
        <Card className="text-center py-12">
          <FileText size={44} className="mx-auto mb-4 text-indigo-300" />
          <p className="text-neutral-500">No documents shared yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {documents.map((doc) => (
            <Card
              key={doc._id}
              className="shadow-md border border-white hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-indigo-100 rounded-lg shrink-0">
                  <FileText size={26} className="text-indigo-600" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-base md:text-lg text-neutral-800">
                    {doc.title}
                  </h3>

                  {doc.description && (
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  <p className="text-xs text-neutral-400 mt-2">
                    Uploaded on{' '}
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.open(doc.fileUrl, '_blank')}
                >
                  <Download size={16} />
                  View / Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
