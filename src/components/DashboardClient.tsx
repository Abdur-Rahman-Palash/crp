import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, BookOpen, GraduationCap, DollarSign, FileText, Calendar, TrendingUp, UserCheck } from 'lucide-react'

interface DashboardClientProps {
  cards: { title: string; href: string; roles: string[] }[]
}

const getIcon = (title: string) => {
  switch (title) {
    case 'Students': return <Users className="w-8 h-8" />
    case 'Teachers': return <UserCheck className="w-8 h-8" />
    case 'Classes': return <GraduationCap className="w-8 h-8" />
    case 'Fees': return <DollarSign className="w-8 h-8" />
    case 'Reports': return <TrendingUp className="w-8 h-8" />
    case 'Payments': return <FileText className="w-8 h-8" />
    case 'Invoices': return <FileText className="w-8 h-8" />
    case 'Attendance': return <Calendar className="w-8 h-8" />
    case 'Marks': return <BookOpen className="w-8 h-8" />
    default: return <BookOpen className="w-8 h-8" />
  }
}

const getColor = (title: string) => {
  switch (title) {
    case 'Students': return 'bg-blue-500 hover:bg-blue-600'
    case 'Teachers': return 'bg-green-500 hover:bg-green-600'
    case 'Classes': return 'bg-purple-500 hover:bg-purple-600'
    case 'Fees': return 'bg-red-500 hover:bg-red-600'
    case 'Reports': return 'bg-indigo-500 hover:bg-indigo-600'
    case 'Payments': return 'bg-emerald-500 hover:bg-emerald-600'
    case 'Invoices': return 'bg-cyan-500 hover:bg-cyan-600'
    case 'Attendance': return 'bg-orange-500 hover:bg-orange-600'
    case 'Marks': return 'bg-pink-500 hover:bg-pink-600'
    default: return 'bg-gray-500 hover:bg-gray-600'
  }
}

export function DashboardClient({ cards }: DashboardClientProps) {
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
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-base-content mb-2">
          School Management System
        </h1>
        <p className="text-lg text-base-content/70">
          Welcome back! Manage your school efficiently
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {cards.map((card, index) => (
          <motion.div key={card.title} variants={item}>
            <Link href={card.href}>
              <div className={`card ${getColor(card.title)} text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}>
                <div className="card-body items-center text-center">
                  <div className="mb-4">
                    {getIcon(card.title)}
                  </div>
                  <h2 className="card-title text-xl font-bold">{card.title}</h2>
                  <p className="text-sm opacity-90">
                    Manage {card.title.toLowerCase()} efficiently
                  </p>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-ghost btn-sm text-white border-white/20 hover:bg-white/10">
                      Access →
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold text-base-content mb-6 text-center">
          Quick Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-primary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Students</div>
            <div className="stat-value text-primary">1,200</div>
            <div className="stat-desc">↗︎ 20% more than last month</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-secondary">
              <UserCheck className="w-8 h-8" />
            </div>
            <div className="stat-title">Active Teachers</div>
            <div className="stat-value text-secondary">85</div>
            <div className="stat-desc">↗︎ 5 new this month</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-accent">
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="stat-title">Monthly Revenue</div>
            <div className="stat-value text-accent">$45,200</div>
            <div className="stat-desc">↗︎ 12% from last month</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-info">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="stat-title">Classes</div>
            <div className="stat-value text-info">48</div>
            <div className="stat-desc">All grades covered</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}