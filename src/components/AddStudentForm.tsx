'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, UserPlus, Save, X } from 'lucide-react'

interface Class {
  id: string
  name: string
  section?: string | null
}

interface AddStudentFormProps {
  classes: Class[]
}

export function AddStudentForm({ classes }: AddStudentFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    classId: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/dashboard/students')
      } else {
        console.error('Failed to create student')
      }
    } catch (error) {
      console.error('Error creating student:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/students">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-ghost btn-circle"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-base-content flex items-center gap-3">
              <UserPlus className="w-10 h-10 text-primary" />
              Add New Student
            </h1>
            <p className="text-base-content/70 mt-2">
              Enter student information to add them to the system
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card bg-base-100 shadow-xl"
        >
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter student's full name"
                    className="input input-bordered input-primary w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Roll Number</span>
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="Enter roll number"
                    className="input input-bordered input-primary w-full"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Class</span>
                </label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className="select select-bordered select-primary w-full"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} {cls.section && ` - Section ${cls.section}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card-actions justify-end mt-8">
                <Link href="/dashboard/students">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="btn btn-outline btn-ghost"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="btn btn-primary btn-lg"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Add Student
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="alert alert-info mt-6"
        >
          <div>
            <h3 className="font-bold">Quick Tips:</h3>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Roll numbers should be unique within each class</li>
              <li>Student names should be entered in full (First Last)</li>
              <li>Email addresses will be used for login credentials</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}