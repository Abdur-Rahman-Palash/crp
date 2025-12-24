import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, UserPlus, Save, X } from 'lucide-react'

export default async function AddStudentPage() {
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') redirect('/dashboard')

  const classes = await prisma.class.findMany({
    orderBy: { name: 'asc' }
  })

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
            <form action={addStudent} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
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

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Additional Information</span>
                </label>
                <textarea
                  name="notes"
                  placeholder="Any additional notes (optional)"
                  className="textarea textarea-bordered textarea-primary w-full h-24"
                />
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
              <li>You can add additional information in the notes field</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

async function addStudent(formData: FormData) {
  'use server'
  const name = formData.get('name') as string
  const rollNo = formData.get('rollNo') as string
  const classId = formData.get('classId') as string

  await prisma.student.create({
    data: {
      name,
      rollNo,
      classId
    }
  })

  redirect('/dashboard/students')
}