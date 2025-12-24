import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserCheck, Plus, Edit, Trash2, BookOpen, GraduationCap, Mail, Search, Filter } from 'lucide-react'

export default async function TeachersPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const teachers = await prisma.teacher.findMany({
    include: { user: true, classes: true },
    orderBy: { user: { name: 'asc' } }
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-base-content flex items-center gap-3">
            <UserCheck className="w-10 h-10 text-primary" />
            Teachers Management
          </h1>
          <p className="text-base-content/70 mt-2">
            Manage teaching staff and their assignments
          </p>
        </div>
        <Link href="/dashboard/teachers/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Teacher
          </motion.button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-primary">
            <UserCheck className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Teachers</div>
          <div className="stat-value text-primary">{teachers.length}</div>
          <div className="stat-desc">Active faculty members</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-secondary">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="stat-title">Subjects Covered</div>
          <div className="stat-value text-secondary">
            {new Set(teachers.flatMap(t => t.subjects)).size}
          </div>
          <div className="stat-desc">Different subjects</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-accent">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="stat-title">Class Assignments</div>
          <div className="stat-value text-accent">
            {teachers.reduce((sum, t) => sum + t.classes.length, 0)}
          </div>
          <div className="stat-desc">Total class assignments</div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-base-100 rounded-lg p-6 shadow mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="input input-bordered flex items-center gap-2">
              <Search className="w-4 h-4" />
              <input type="text" className="grow" placeholder="Search teachers..." />
            </label>
          </div>
          <div className="flex gap-2">
            <select className="select select-bordered">
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>Science</option>
              <option>English</option>
            </select>
            <button className="btn btn-outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Teachers Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {teachers.map((teacher) => (
          <motion.div
            key={teacher.id}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span className="text-lg font-bold">
                      {teacher.user.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="card-title text-lg">{teacher.user.name}</h3>
                  <p className="text-base-content/70 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {teacher.user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-sm font-semibold text-base-content/70">Subjects:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {teacher.subjects.map((subject, index) => (
                      <span key={index} className="badge badge-primary badge-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-semibold text-base-content/70">Classes:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {teacher.classes.length > 0 ? (
                      teacher.classes.map((cls) => (
                        <span key={cls.id} className="badge badge-secondary badge-sm">
                          {cls.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-base-content/50 text-sm">No classes assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-actions justify-end">
                <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline btn-sm btn-info"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </motion.button>
                </Link>

                <div className="dropdown dropdown-top">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    tabIndex={0}
                    className="btn btn-outline btn-sm btn-error"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </motion.button>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <a className="text-error">
                        <Trash2 className="w-4 h-4" />
                        Confirm Delete
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {teachers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <UserCheck className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content/70 mb-2">
            No Teachers Found
          </h3>
          <p className="text-base-content/50 mb-6">
            Start by adding your first teacher to the system.
          </p>
          <Link href="/dashboard/teachers/add">
            <button className="btn btn-primary btn-lg">
              <Plus className="w-5 h-5 mr-2" />
              Add First Teacher
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}