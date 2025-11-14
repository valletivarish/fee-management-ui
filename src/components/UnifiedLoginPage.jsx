import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { ArrowRight, CheckCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react'

import axios from 'axios'



import { useAuth } from '../contexts/AuthContext'

import { DEMO_ACCOUNTS, API_BASE_URL } from '../config'

import { studentAPI } from '../services/api'

import '../fm-login.css'



const UnifiedLoginPage = () => {

  const navigate = useNavigate()

  const { login } = useAuth()



  const [activeAccountId, setActiveAccountId] = useState(null)

  const [formData, setFormData] = useState({

    usernameOrEmail: '',

    password: '',

  })

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const [passwordModal, setPasswordModal] = useState({

    open: false,

    email: '',

    currentPassword: '',

    nextAction: null,

  })

  const [newPassword, setNewPassword] = useState('')

  const [confirmPassword, setConfirmPassword] = useState('')

  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showDemoPrompt, setShowDemoPrompt] = useState(true)



  const activeAccount =

    DEMO_ACCOUNTS.find((account) => account.id === activeAccountId) ?? null



  const hasManualCredentials =
    !activeAccount &&
    formData.usernameOrEmail.trim().length > 0 &&
    formData.password.trim().length > 0

  const canSubmit = Boolean(activeAccount) || hasManualCredentials





  const handleAccountSwitch = (accountId) => {

    if (activeAccountId === accountId) {
      setActiveAccountId(null)
      setFormData({
        usernameOrEmail: '',
        password: '',
      })
      setShowDemoPrompt(false)
      setError('')
      return
    }

    const nextAccount =

      DEMO_ACCOUNTS.find((account) => account.id === accountId) ?? null

    setActiveAccountId(nextAccount?.id ?? null)

    setFormData({
      usernameOrEmail: nextAccount?.usernameOrEmail ?? '',
      password: nextAccount?.password ?? '',
    })
    setShowDemoPrompt(false)
    setError('')

  }



  const handlePasswordReset = async (event) => {

    event.preventDefault()

    setPasswordError('')



    if (!newPassword || newPassword.length < 8) {

      setPasswordError('New password must be at least 8 characters long.')

      return

    }



    if (newPassword !== confirmPassword) {

      setPasswordError('Passwords do not match.')

      return

    }



    try {

      await axios.post(`${API_BASE_URL}/auth/change-password`, {

        email: passwordModal.email,

        currentPassword: passwordModal.currentPassword,

        newPassword,

      })

      setPasswordModal((prev) => ({ ...prev, open: false }))

      setNewPassword('')

      setConfirmPassword('')

      await passwordModal.nextAction?.()

    } catch (err) {

      const message =

        err?.response?.data?.message ||

        err?.response?.data?.error ||

        err?.message ||

        'Unable to change password. Please try again.'

      setPasswordError(message)

    }

  }



  const handleChange = (event) => {

    const { name, value } = event.target

    if (showDemoPrompt) {
      setShowDemoPrompt(false)
    }

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }))

  }



  const routeToStudentDashboard = async (email) => {

    try {

      const response = await studentAPI.getAll()

      const students = Array.isArray(response.data) ? response.data : []

      const matchedStudent = students.find((student) =>

        (student.email || '').toLowerCase() === (email || '').toLowerCase()

      )



      if (matchedStudent) {

        navigate(`/student/${matchedStudent.id}`)

        return

      }

    } catch (lookupError) {

      console.warn('Unable to auto-select student dashboard, falling back.', lookupError)

    }



    navigate('/student-selection')

  }



  const handleSubmit = async (event) => {

    event.preventDefault()

    setLoading(true)

    setError('')



    try {

      if (!activeAccount && !hasManualCredentials) {

        setError('Enter your credentials or select a demo profile to continue.')

        return

      }



      const authResponse = await login(formData)

      const responseRole =

        authResponse?.role ||

        (Array.isArray(authResponse?.roles) && authResponse.roles.length > 0

          ? authResponse.roles[0]

          : undefined) ||

        activeAccount?.role ||

        ''

      const normalizedRole = responseRole.toString().toUpperCase()

      const isAdmin = normalizedRole.includes('ADMIN')

      if (isAdmin) {

        navigate('/admin')

      } else {

        const studentEmail = activeAccount?.usernameOrEmail || formData.usernameOrEmail

        if (

          authResponse?.mustChangePassword &&

          !activeAccount?.skipPasswordPrompt

        ) {

          setPasswordModal({

            open: true,

            email: studentEmail,

            currentPassword: formData.password,

            nextAction: () => routeToStudentDashboard(studentEmail),

          })

          return

        }

        await routeToStudentDashboard(studentEmail)

      }

    } catch (err) {

      const message =

        err?.response?.data?.message ||

        err?.response?.data?.error ||

        err?.message ||

        'Unable to sign in. Please check the credentials and try again.'

      setError(message)

    } finally {

      setLoading(false)

    }

  }



  return (

    <div className="fm-layout-root">

      <div className="fm-layout-shell">

        <header className="fm-layout-header">
          {/* <div className="fm-brand-badge">FeeFlow</div> */}
          {/* <span className="fm-header-copy">Unified fee management platform</span> */}
        </header>

        <div className="fm-layout-grid">

        <section className="fm-left-hero-container" aria-label="Platform overview">

          <div className="fm-hero-illustration">

            <img src="/assets/finance-illustration.jpg" alt="Finance management illustration" />

          </div>

          <div className="fm-hero-details">

            {/* <p className="fm-hero-tagline">Unified finance platform</p> */}

            <h1 className="fm-hero-heading">Fee Management System</h1>

            <p className="fm-hero-description">

              Streamline fee collection, automate reporting, and give students clarity on every payment interaction.

            </p>

            

            <ul className="fm-feature-list">

              {[

                { title: 'Smart Admin Console', desc: 'Monitor students, fee plans, and collections in one place.' },

                { title: 'Automated Workflows', desc: 'Automate dues, reminders, and installment schedules.' },

                { title: 'Student Portal', desc: 'Students view balances, receipts, and payment history instantly.' },

              ].map((feature) => (

                <li key={feature.title} className="fm-feature-item">

                  <CheckCircle className="fm-feature-icon" aria-hidden="true" />

                  <div className="fm-feature-text">

                    <strong>{feature.title}</strong>

                    <span>{feature.desc}</span>

                  </div>

                </li>

              ))}

            </ul>

          </div>

        </section>



        <section className="fm-login-card-column" aria-label="Sign in form">

          <div className="fm-login-card-wrapper">

            <header className="fm-login-card-header">

              <h2 className="fm-login-title">Welcome back</h2>

              <p className="fm-login-subtitle">Sign in with your institution-issued credentials.</p>

            </header>



            <div className={`fm-login-selected-pill ${activeAccount ? '' : 'fm-login-selected-pill--placeholder'}`}>

              {activeAccount ? (

                <>

                  <span className="fm-login-pill-label">Signing in as</span>

                  <span className="fm-login-pill-value">{activeAccount.label}</span>

                  <span className="fm-login-pill-role">{activeAccount.roleLabel}</span>

                </>

              ) : (

                <span>Enter your credentials or select a demo account to continue.</span>

              )}

            </div>



            {error ? (

              <div className="fm-login-error-message" role="alert">

                {error}

              </div>

            ) : null}



            <form className="fm-login-form" onSubmit={handleSubmit} noValidate>

              <div className="fm-login-field fm-login-field-email">

                <label className="fm-login-field-label" htmlFor="usernameOrEmail">

                  Username or Email

                </label>

                <div className="fm-login-input-wrapper">

                  <Mail className="fm-login-input-icon" aria-hidden="true" />

                  <input

                    id="usernameOrEmail"

                    name="usernameOrEmail"

                    type="text"

                    className="fm-login-input"

                    value={formData.usernameOrEmail}

                    onChange={handleChange}

                    autoComplete="username"

                    required

                    placeholder="name@institution.edu"

                  />

                </div>

              </div>



              <div className="fm-login-field fm-login-field-password">

                <label className="fm-login-field-label" htmlFor="password">

                  Password

                </label>

                <div className="fm-login-password-wrapper">

                  <Lock className="fm-login-input-icon" aria-hidden="true" />

                  <input

                    id="password"

                    name="password"

                    type={showPassword ? 'text' : 'password'}

                    className="fm-login-input"

                    value={formData.password}

                    onChange={handleChange}

                    autoComplete="current-password"

                    required

                    placeholder="Enter your password"

                  />

                  <button

                    type="button"

                    className="fm-login-password-icon"

                    onClick={() => setShowPassword((prev) => !prev)}

                    aria-label={showPassword ? 'Hide password' : 'Show password'}

                  >

                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}

                  </button>

                </div>

                <p className="fm-login-field-hint">
                  <strong>New student access:</strong> Use the initial password <code>FeeM@2025</code> the first time you sign in, then update it when prompted.
                </p>

              </div>



              <button

                type="submit"

                className="fm-login-button"

                disabled={loading || !canSubmit}

              >

                {loading ? 'Signing in…' : 'Sign In'}

                <ArrowRight className="fm-login-button-icon" aria-hidden="true" />

              </button>

              <p className="fm-login-helper-text">

                Having trouble? Contact your campus administrator for assistance.

              </p>

            </form>

          </div>



          <div className="fm-demo-credentials-container" role="group" aria-labelledby="fm-demo-profiles">

            <div className="fm-demo-header">

              <span className="fm-demo-tag">Demo profiles</span>

              <h3 id="fm-demo-profiles">Explore in seconds</h3>

            </div>

            <div className="fm-demo-credentials-grid">

              {DEMO_ACCOUNTS.map((account) => {

                const isActive = activeAccountId === account.id

                return (

                  <button

                    key={account.id}

                    type="button"

                    className={`fm-demo-item ${isActive ? 'fm-demo-item-selected' : ''}`}

                    onClick={() => handleAccountSwitch(account.id)}

                    disabled={loading}

                    aria-pressed={isActive}

                  >

                    <div className="fm-demo-item-header">

                      <span className="fm-demo-item-name">{account.label}</span>

                      {/* <span className="fm-demo-item-role">{account.roleLabel}</span> */}

                    </div>

                    {isActive ? (

                      <p className="fm-demo-item-description">{account.description}</p>

                    ) : null}

                  </button>

                )

              })}

            </div>

          </div>

        </section>

        </div>

      </div>



      {passwordModal.open && (

        <div className="fm-modal-layer" role="dialog" aria-modal="true">

          <div className="fm-modal-card">

            <h3 className="fm-modal-title">Update Temporary Password</h3>

            <p className="fm-modal-subtitle">Set a new password before continuing to your dashboard.</p>

            {passwordError && <div className="fm-modal-error">{passwordError}</div>}

            <form onSubmit={handlePasswordReset} className="fm-modal-form">

              <label className="fm-login-field-label" htmlFor="newPassword">New Password</label>

              <input

                id="newPassword"

                type="password"

                className="fm-login-input"

                value={newPassword}

                onChange={(e) => setNewPassword(e.target.value)}

                required

                minLength={8}

                placeholder="Enter a new password"

              />

              <label className="fm-login-field-label" htmlFor="confirmPassword">Confirm Password</label>

              <input

                id="confirmPassword"

                type="password"

                className="fm-login-input"

                value={confirmPassword}

                onChange={(e) => setConfirmPassword(e.target.value)}

                required

                placeholder="Re-enter new password"

              />

              <div className="fm-modal-actions">

                <button

                  type="button"

                  className="fm-button-secondary"

                  onClick={() => {

                    setPasswordModal((prev) => ({ ...prev, open: false }))

                    setPasswordError('')

                    setNewPassword('')

                    setConfirmPassword('')

                  }}

                >

                  Cancel

                </button>

                <button type="submit" className="fm-login-button">

                  Save Password

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {showDemoPrompt && !passwordModal.open && !activeAccount && !hasManualCredentials && (
        <div className="fm-modal-layer" role="dialog" aria-modal="true">
          <div className="fm-demo-modal-card">
            <div className="fm-demo-modal-header">
              <h3>Want to explore quickly?</h3>
              <p>Select a demo persona and we’ll prefill the credentials for you.</p>
            </div>
            <div className="fm-demo-modal-grid">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  className="fm-demo-modal-option"
                  onClick={() => handleAccountSwitch(account.id)}
                >
                  <span className="fm-demo-modal-name">{account.label}</span>
                  <span className="fm-demo-modal-role">{account.roleLabel}</span>
                  <p className="fm-demo-modal-desc">{account.description}</p>
                </button>
              ))}
            </div>
            <div className="fm-demo-modal-actions">
              <button
                type="button"
                className="fm-button-secondary"
                onClick={() => setShowDemoPrompt(false)}
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  )

}



export default UnifiedLoginPage



