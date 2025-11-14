import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'
import { DEMO_ACCOUNTS } from '../config'
import { studentAPI } from '../services/api'

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

  const activeAccount =
    DEMO_ACCOUNTS.find((account) => account.id === activeAccountId) ?? null

  const handleAccountSwitch = (accountId) => {
    const nextAccount =
      DEMO_ACCOUNTS.find((account) => account.id === accountId) ?? null
    setActiveAccountId(nextAccount?.id ?? null)
    setFormData({
      usernameOrEmail: nextAccount?.usernameOrEmail ?? '',
      password: nextAccount?.password ?? '',
    })
    setError('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
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
      if (!activeAccount) {
        setError('Choose one of the quick accounts below to sign in.')
        return
      }

      await login({ ...formData, role: activeAccount.role })
      if (activeAccount.role === 'admin') {
        navigate('/admin')
      } else {
        await routeToStudentDashboard(activeAccount.usernameOrEmail)
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
    <div className="login-page">
      <div className="login-wrapper">
        <section className="login-hero" aria-label="Platform overview and demo credentials">
          <header className="login-hero__header">
            <span className="login-hero__tag">Unified finance platform</span>
            <h1 className="login-hero__title">Fee Management System</h1>
            <p className="login-hero__subtitle">
              Streamline fee collection and student finance operations with a unified dashboard designed for administrators and learners.
            </p>
          </header>

          <div className="login-hero__body">
            <ul className="login-hero__highlights">
              {[
                'Manage students, fee plans, assignments, and payments in one place.',
                'Track balances, payment history, and trends with real-time insights.',
                'Provide students with transparent statements and secure payment options.',
              ].map((item) => (
                <li key={item} className="login-hero__highlight">
                  <CheckCircle className="login-hero__icon" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="login-hero__quick" role="group" aria-labelledby="demo-credentials-heading">
              <div className="login-hero__quick-heading">
                <span id="demo-credentials-heading" className="login-hero__quick-label">
                  Demo credentials
                </span>
                <p className="login-hero__quick-body">
                  Select a persona to pre-fill credentials and jump into the corresponding experience instantly.
                </p>
              </div>

              <div className="login-role-toggle">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    className={`login-role-button ${
                      activeAccountId === account.id ? 'active' : ''
                    }`}
                    onClick={() => handleAccountSwitch(account.id)}
                    disabled={loading}
                    aria-pressed={activeAccountId === account.id}
                  >
                    <span className="login-role-button__label">{account.label}</span>
                    <span className="login-role-button__hint">
                      {account.roleLabel}
                    </span>
                  </button>
                ))}
              </div>

              <div
                className={`login-selected-role ${
                  activeAccount ? '' : 'placeholder'
                }`}
                role="status"
                aria-live="polite"
              >
                <span className="login-selected-role__label">Selected role</span>
                <span className="login-selected-role__value">
                  {activeAccount ? activeAccount.roleLabel : 'None yet'}
                </span>
              </div>
              {activeAccount ? (
                <p className="login-selected-description">
                  {activeAccount.description}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <div className="login-card" aria-label="Sign in form">
          <div className="login-card__header">
            <h2 className="login-title">Welcome back</h2>
            <p className="login-subtitle">Sign in to continue</p>
          </div>

          <div className="login-card__body">
            <div
              className={`login-selected-pill ${
                activeAccount ? '' : 'placeholder'
              }`}
            >
              {activeAccount ? (
                <>
                  <span className="login-selected-pill__label">Signing in as</span>
                  <span className="login-selected-pill__value">
                    {activeAccount.label}
                  </span>
                  <span className="login-selected-pill__role">
                    {activeAccount.roleLabel}
                  </span>
                </>
              ) : (
                <span>Select a demo account from the left column to prefill credentials.</span>
              )}
            </div>

            {error ? (
              <div className="login-alert error" role="alert">
                {error}
              </div>
            ) : null}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-form-group">
                <label className="login-label" htmlFor="usernameOrEmail">
                  Username or Email
                </label>
                <input
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  className="login-input"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="login-form-group">
                <label className="login-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="login-input"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading || !activeAccount}
              >
                {loading ? 'Signing in…' : 'Sign In'}
                <ArrowRight className="button-arrow" aria-hidden="true" />
              </button>
            </form>
          </div>

          <footer className="login-card__footer">
            <p className="login-card__hint">
              Prefer using your own account? Enter the credentials provided by your administrator.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default UnifiedLoginPage

