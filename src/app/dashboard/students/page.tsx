import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Users, Search, Filter } from 'lucide-react'

export default async function StudentsPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const students = await prisma.student.findMany({
    include: { class: true },
    orderBy: { name: 'asc' }
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
            <Users className="w-10 h-10 text-primary" />
            Students Management
          </h1>
          <p className="text-base-content/70 mt-2">
            Manage student records and information
          </p>
        </div>
        <Link href="/dashboard/students/add">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Student
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
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Students</div>
          <div className="stat-value text-primary">{students.length}</div>
          <div className="stat-desc">Active enrollments</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-secondary">
            <Filter className="w-8 h-8" />
          </div>
          <div className="stat-title">Classes</div>
          <div className="stat-value text-secondary">
            {new Set(students.map(s => s.classId)).size}
          </div>
          <div className="stat-desc">Different classes</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-accent">
            <Search className="w-8 h-8" />
          </div>
          <div className="stat-title">Search & Filter</div>
          <div className="stat-value text-accent">Available</div>
          <div className="stat-desc">Advanced filtering</div>
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
              <input type="text" className="grow" placeholder="Search students..." />
            </label>
          </div>
          <div className="flex gap-2">
            <select className="select select-bordered">
              <option>All Classes</option>
              <option>Class 1</option>
              <option>Class 2</option>
            </select>
            <button className="btn btn-outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </motion.div>

      {/* Students Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {students.map((student) => (
          <motion.div
            key={student.id}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-12">
                    <span className="text-lg font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="card-title text-lg">{student.name}</h3>
                  <p className="text-base-content/70">Roll: {student.rollNo}</p>
                </div>
              </div>

              <div className="badge badge-primary badge-outline mb-4">
                {student.class.name}
              </div>

              <div className="card-actions justify-end">
                <Link href={`/dashboard/students/${student.id}/edit`}>
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

      {students.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content/70 mb-2">
            No Students Found
          </h3>
          <p className="text-base-content/50 mb-6">
            Start by adding your first student to the system.
          </p>
          <Link href="/dashboard/students/add">
            <button className="btn btn-primary btn-lg">
              <Plus className="w-5 h-5 mr-2" />
              Add First Student
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  )
}