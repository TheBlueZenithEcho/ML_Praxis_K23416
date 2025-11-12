import React from 'react';
import { MoreVertical, Edit, Trash2, Eye, Download, Share2 } from 'lucide-react';

interface DesignCardProps {
  id: string;
  image: string;
  designName: string;
  projectName?: string;
  tags?: string[];
  dateCreated?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
}

const DesignCard: React.FC<DesignCardProps> = ({
  id,
  image,
  designName,
  projectName,
  tags = [],
  dateCreated,
  onEdit,
  onDelete,
  onView,
  onDownload,
  onShare
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={designName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
          onClick={() => onView?.(id)}
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onView && (
            <button
              onClick={() => onView(id)}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
              title="View"
            >
              <Eye size={20} className="text-gray-700" />
            </button>
          )}
          {onDownload && (
            <button
              onClick={() => onDownload(id)}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
              title="Download"
            >
              <Download size={20} className="text-gray-700" />
            </button>
          )}
          {onShare && (
            <button
              onClick={() => onShare(id)}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
              title="Share"
            >
              <Share2 size={20} className="text-gray-700" />
            </button>
          )}
        </div>
        
        {/* Menu Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            <MoreVertical size={16} className="text-gray-700" />
          </button>
          
          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg py-1 w-40 z-10">
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 bg-[#6B7566]">
        <h3 className="font-semibold text-white mb-1 truncate">{designName}</h3>
        {projectName && (
          <p className="text-sm text-gray-200 truncate mb-2">{projectName}</p>
        )}
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {dateCreated && (
          <p className="text-xs text-gray-300">{dateCreated}</p>
        )}
      </div>
    </div>
  );
};

export default DesignCard;