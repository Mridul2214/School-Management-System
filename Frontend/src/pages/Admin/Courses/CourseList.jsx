import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Courses</h1>
                    <p className="page-subtitle">Manage academic courses types</p>
                </div>
                <Link to="/admin/courses/add" className="btn-primary flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                </Link>
            </div>

            <div className="search-bar-container">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Courses Table/Grid */}
            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="card-grid">
                    {filteredCourses.map((course) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="item-card flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="item-card-header">
                                    <div className="badge-code">
                                        {course.code}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="action-btn">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="action-btn-danger">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {course.description || "No description provided."}
                                </p>

                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{course.duration} Semesters</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="h-4 w-4 mr-2 flex items-center justify-center font-bold text-xs bg-gray-100 rounded">C</div>
                                        <span>{course.totalCredits} Credits</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm">
                                <span className="text-gray-500">Department: </span>
                                <span className="font-medium text-gray-900">
                                    {course.department ? `${course.department.name} (${course.department.code})` : 'N/A'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;
