import React, { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import SettingsSidebar, { SECTIONS } from '../../components/settings/SettingsSidebar'
import SettingsSection from '../../components/settings/SettingsSection'
import { FormInput, FormSelect, FormToggle, FormTextarea, FormColorPicker, FormButtonGroup } from '../../components/settings/SettingsForm'

const STORAGE_KEY = 'lms_admin_settings'

const DEFAULT_SETTINGS = {
  general: {
    platformName: 'Moodle LMS',
    logo: '',
    supportEmail: 'support@moodle.local',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Education Street, City, Country',
  },
  course: {
    defaultLanguage: 'English',
    allowFreeCourses: true,
    courseApprovalRequired: false,
    maxUploadSize: '100MB',
  },
  user: {
    allowStudentRegistration: true,
    emailVerificationRequired: true,
    defaultUserRole: 'student',
  },
  payment: {
    currency: 'USD',
    paymentGatewayKey: '',
    enablePayments: false,
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpEmail: '',
    smtpPassword: '',
  },
  platform: {
    maintenanceMode: false,
    defaultThemeColor: '#3B82F6',
    footerText: '© 2026 Moodle LMS. All rights reserved.',
  },
}

function Settings() {
  const { isDarkMode } = useTheme()
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [savedMessage, setSavedMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setSettings(JSON.parse(stored))
      } catch (e) {
        setSettings(DEFAULT_SETTINGS)
      }
    }
  }, [])

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSave = (section) => {
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      setIsSaving(false)
      setSavedMessage(`${SECTIONS.find(s => s.id === section)?.label} saved successfully!`)
      setTimeout(() => setSavedMessage(''), 3000)
    }, 600)
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <SettingsSection
            title="General Settings"
            description="Configure basic platform information and contact details"
            isDarkMode={isDarkMode}
          >
            <FormInput
              label="Platform Name"
              name="platformName"
              value={settings.general.platformName}
              onChange={(e) => handleInputChange('general', 'platformName', e.target.value)}
              placeholder="Enter platform name"
              isDarkMode={isDarkMode}
              required
            />
            <FormInput
              label="Support Email"
              name="supportEmail"
              type="email"
              value={settings.general.supportEmail}
              onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
              placeholder="support@example.com"
              isDarkMode={isDarkMode}
              required
            />
            <FormInput
              label="Contact Phone"
              name="contactPhone"
              value={settings.general.contactPhone}
              onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              isDarkMode={isDarkMode}
            />
            <FormTextarea
              label="Address"
              name="address"
              value={settings.general.address}
              onChange={(e) => handleInputChange('general', 'address', e.target.value)}
              placeholder="Enter full address"
              isDarkMode={isDarkMode}
              rows={3}
            />
            <FormButtonGroup
              onSave={() => handleSave('general')}
              isDarkMode={isDarkMode}
              isLoading={isSaving}
            />
          </SettingsSection>
        )

      case 'course':
        return (
          <SettingsSection
            title="Course Settings"
            description="Manage course-related configurations"
            isDarkMode={isDarkMode}
          >
            <FormSelect
              label="Default Course Language"
              name="defaultLanguage"
              value={settings.course.defaultLanguage}
              onChange={(e) => handleInputChange('course', 'defaultLanguage', e.target.value)}
              options={[
                { value: 'English', label: 'English' },
                { value: 'Spanish', label: 'Spanish' },
                { value: 'French', label: 'French' },
                { value: 'German', label: 'German' },
                { value: 'Chinese', label: 'Chinese' },
              ]}
              isDarkMode={isDarkMode}
              required
            />
            <FormToggle
              label="Allow Free Courses"
              name="allowFreeCourses"
              checked={settings.course.allowFreeCourses}
              onChange={(e) => handleInputChange('course', 'allowFreeCourses', e.target.checked)}
              isDarkMode={isDarkMode}
              description="Allow course creators to create courses without charging fees"
            />
            <FormToggle
              label="Course Approval Required"
              name="courseApprovalRequired"
              checked={settings.course.courseApprovalRequired}
              onChange={(e) => handleInputChange('course', 'courseApprovalRequired', e.target.checked)}
              isDarkMode={isDarkMode}
              description="Require admin approval before courses go live"
            />
            <FormInput
              label="Maximum Upload Size"
              name="maxUploadSize"
              value={settings.course.maxUploadSize}
              onChange={(e) => handleInputChange('course', 'maxUploadSize', e.target.value)}
              placeholder="e.g., 100MB, 500MB"
              isDarkMode={isDarkMode}
            />
            <FormButtonGroup
              onSave={() => handleSave('course')}
              isDarkMode={isDarkMode}
              isLoading={isSaving}
            />
          </SettingsSection>
        )

      case 'user':
        return (
          <SettingsSection
            title="User Settings"
            description="Configure user registration and authentication"
            isDarkMode={isDarkMode}
          >
            <FormToggle
              label="Allow Student Registration"
              name="allowStudentRegistration"
              checked={settings.user.allowStudentRegistration}
              onChange={(e) => handleInputChange('user', 'allowStudentRegistration', e.target.checked)}
              isDarkMode={isDarkMode}
              description="Allow new users to register as students"
            />
            <FormToggle
              label="Email Verification Required"
              name="emailVerificationRequired"
              checked={settings.user.emailVerificationRequired}
              onChange={(e) => handleInputChange('user', 'emailVerificationRequired', e.target.checked)}
              isDarkMode={isDarkMode}
              description="Require email verification during registration"
            />
            <FormSelect
              label="Default User Role"
              name="defaultUserRole"
              value={settings.user.defaultUserRole}
              onChange={(e) => handleInputChange('user', 'defaultUserRole', e.target.value)}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'instructor', label: 'Instructor' },
                { value: 'admin', label: 'Admin' },
              ]}
              isDarkMode={isDarkMode}
              required
            />
            <FormButtonGroup
              onSave={() => handleSave('user')}
              isDarkMode={isDarkMode}
              isLoading={isSaving}
            />
          </SettingsSection>
        )

      case 'payment':
        return (
          <SettingsSection
            title="Payment Settings"
            description="Configure payment gateway and currency settings"
            isDarkMode={isDarkMode}
          >
            <FormSelect
              label="Currency"
              name="currency"
              value={settings.payment.currency}
              onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'GBP', label: 'GBP (£)' },
                { value: 'INR', label: 'INR (₹)' },
              ]}
              isDarkMode={isDarkMode}
              required
            />
            <FormToggle
              label="Enable Payments"
              name="enablePayments"
              checked={settings.payment.enablePayments}
              onChange={(e) => handleInputChange('payment', 'enablePayments', e.target.checked)}
              isDarkMode={isDarkMode}
              description="Enable payment processing for paid courses"
            />
            <FormInput
              label="Payment Gateway Key"
              name="paymentGatewayKey"
              type="password"
              value={settings.payment.paymentGatewayKey}
              onChange={(e) => handleInputChange('payment', 'paymentGatewayKey', e.target.value)}
              placeholder="Enter API key"
              isDarkMode={isDarkMode}
            />
            <FormButtonGroup
              onSave={() => handleSave('payment')}
              isDarkMode={isDarkMode}
              isLoading={isSaving}
            />
          </SettingsSection>
        )

      case 'email':
        return (
          <SettingsSection
            title="Email Settings"
            description="Configure SMTP settings for email notifications"
            isDarkMode={isDarkMode}
          >
            <FormInput
              label="SMTP Host"
              name="smtpHost"
              value={settings.email.smtpHost}
              onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
              placeholder="smtp.gmail.com"
              isDarkMode={isDarkMode}
              required
            />
            <FormInput
              label="SMTP Port"
              name="smtpPort"
              value={settings.email.smtpPort}
              onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
              placeholder="587"
              isDarkMode={isDarkMode}
              required
            />
            <FormInput
              label="SMTP Email"
              name="smtpEmail"
              type="email"
              value={settings.email.smtpEmail}
              onChange={(e) => handleInputChange('email', 'smtpEmail', e.target.value)}
              placeholder="your-email@gmail.com"
              isDarkMode={isDarkMode}
              required
            />
            <FormInput
              label="SMTP Password"
              name="smtpPassword"
              type="password"
              value={settings.email.smtpPassword}
              onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
              placeholder="Enter password"
              isDarkMode={isDarkMode}
              required
            />
            <FormButtonGroup
              onSave={() => handleSave('email')}
              isDarkMode={isDarkMode}
              isLoading={isSaving}
            />
          </SettingsSection>
        )

      case 'platform':
        return (
          <SettingsSection
            title="Platform Settings"
            description="Configure platform appearance and behavior"
            isDarkMode={isDarkMode}
          >
            <FormToggle
              label="Maintenance Mode"
              name="maintenanceMode"
              checked={settings.platform.maintenanceMode}
              onChange={(e) => handleInputChange('platform', 'maintenanceMode', e.target.checked)}
              isDarkMode={isDarkMode}
              description="Put platform in maintenance mode (only admins can access)"
            />
            <FormColorPicker
              label="Default Theme Color"
              name="defaultThemeColor"
              value={settings.platform.defaultThemeColor}
              onChange={(e) => handleInputChange('platform', 'defaultThemeColor', e.target.value)}
              isDarkMode={isDarkMode}
            />
            <FormTextarea
              label="Footer Text"
              name="footerText"
              value={settings.platform.footerText}
              onChange={(e) => handleInputChange('platform', 'footerText', e.target.value)}
              placeholder="Enter footer text"
              isDarkMode={isDarkMode}
              rows={3}
            />
            <FormButtonGroup
              onSave={() => handleSave('platform')}
              isDarkMode={isDarkMode}
              isLoading={isSaving}
            />
          </SettingsSection>
        )

      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Admin Settings
          </h1>
          <p className={`mt-2 transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Manage your LMS platform configuration
          </p>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-300 font-medium">{savedMessage}</p>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Hidden on mobile, visible on lg */}
          <div className="lg:col-span-1">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Mobile Tabs - Visible on mobile, hidden on lg */}
          <div className="lg:hidden mb-6 flex flex-wrap gap-2">
            {SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings