'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Users } from 'lucide-react'

interface Student {
  id: string
  name: string
  rollNo: string
  class: {
    id: string
    name: string
  } | null
}

interface StudentsClientProps {
  students: Student[]
}

export function StudentsClient({ students }: StudentsClientProps) {
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
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
            <Users className="w-8 h-8" />
            Students Management
          </h1>
          <p className="text-base-content/70 mt-1">Manage student records and information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          <Link href="/dashboard/students/add">Add Student</Link>
        </motion.button>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {students.map((student) => (
          <motion.div
            key={student.id}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title text-lg font-bold">{student.name}</h2>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Roll No:</span>
                  {student.rollNo}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Class:</span>
                  <span className="badge badge-primary">
                    {student.class?.name || 'Not Assigned'}
                  </span>
                </p>
              </div>
              <div className="card-actions justify-end mt-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn btn-sm btn-outline btn-info"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn btn-sm btn-outline btn-error"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {students.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
          <h3 className="text-xl font-semibold text-base-content/70 mb-2">No Students Found</h3>
          <p className="text-base-content/50 mb-6">Get started by adding your first student</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            <Link href="/dashboard/students/add">Add First Student</Link>
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}