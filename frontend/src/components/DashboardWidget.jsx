import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { FiMoreVertical, FiExternalLink } from 'react-icons/fi';
import { format } from 'date-fns';

const DashboardWidget = ({ id, widget, data, delay }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderContent = () => {
    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
          <p>No {widget.type} yet</p>
          <Link
            to={`/${widget.type}`}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Create your first one
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {data.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                    {item.description}
                  </p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                  >
                    Visit <FiExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {item.priority && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  item.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {item.priority}
                </span>
              )}
            </div>
            {item.createdAt && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                {format(new Date(item.createdAt), 'MMM dd, yyyy')}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div
        {...attributes}
        {...listeners}
        className={`px-6 py-4 bg-${widget.color}-50 dark:bg-${widget.color}-900/20 border-b border-gray-200 dark:border-gray-700 cursor-move`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-${widget.color}-100 dark:bg-${widget.color}-900/30 rounded-lg flex items-center justify-center`}>
              <widget.icon className={`w-5 h-5 text-${widget.color}-600 dark:text-${widget.color}-400`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {widget.title}
            </h3>
          </div>
          <Link
            to={`/${widget.type}`}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
          >
            View All
          </Link>
        </div>
      </div>
      <div className="p-6">
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default DashboardWidget;
