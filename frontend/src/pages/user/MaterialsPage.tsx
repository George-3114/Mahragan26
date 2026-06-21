import { Download, FileText } from 'lucide-react';
import { useServices } from '../../context/FestivalContext';
import { usePublishedMaterials } from '../../hooks';
import { formatEnumLabel } from '../admin/adminUtils';

function MaterialsPage() {
  const { data: materials, loading } = usePublishedMaterials();
  const { materials: materialService } = useServices();
  const items = Array.isArray(materials) ? materials : [];

  async function handleDownload(id: string, fileUrl: string, title: string) {
    await materialService.recordDownload(id);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Materials</h1>
      <p className="text-gray-500 mb-6">Download festival resources and study materials.</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
          No published materials available yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((material) => (
            <div key={material.id} className="bg-white rounded-2xl shadow-md p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800">{material.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{material.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  {formatEnumLabel(material.category)}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  {formatEnumLabel(material.type)}
                </span>
                <span>
                  {material.publishedAt
                    ? new Date(material.publishedAt).toLocaleDateString()
                    : new Date(material.createdAt).toLocaleDateString()}
                </span>
                <span>{material.downloadCount} downloads</span>
              </div>
              <button
                type="button"
                onClick={() => handleDownload(material.id, material.fileUrl, material.title)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MaterialsPage;
