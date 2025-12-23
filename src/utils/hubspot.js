/**
 * HubSpot Integration Utility
 * Supports both HubSpot Forms Embed and Forms API
 */

const HUBSPOT_PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID
const HUBSPOT_FORM_ID = import.meta.env.VITE_HUBSPOT_FORM_ID

/**
 * Submit email to HubSpot using Forms API
 * @param {string} email - Email address to submit
 * @param {object} additionalFields - Additional form fields (optional)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function submitToHubSpot(email, additionalFields = {}) {
  if (!HUBSPOT_PORTAL_ID || !HUBSPOT_FORM_ID) {
    // Fallback: Store locally if HubSpot not configured
    console.warn('HubSpot not configured. Storing email locally.')
    const emails = JSON.parse(localStorage.getItem('waitlist_emails') || '[]')
    emails.push({ email, timestamp: new Date().toISOString(), ...additionalFields })
    localStorage.setItem('waitlist_emails', JSON.stringify(emails))
    return { success: true, message: 'Thanks for joining! We\'ll be in touch soon.' }
  }

  try {
    const formData = {
      fields: [
        {
          name: 'email',
          value: email
        },
        ...Object.entries(additionalFields).map(([name, value]) => ({
          name,
          value: String(value)
        }))
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title
      }
    }

    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    )

    if (response.ok) {
      return { success: true, message: 'Thanks for joining! We\'ll be in touch soon.' }
    } else {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to submit form')
    }
  } catch (error) {
    console.error('HubSpot submission error:', error)
    // Fallback: Store locally on error
    const emails = JSON.parse(localStorage.getItem('waitlist_emails') || '[]')
    emails.push({ email, timestamp: new Date().toISOString(), ...additionalFields })
    localStorage.setItem('waitlist_emails', JSON.stringify(emails))
    return { 
      success: true, 
      message: 'Thanks for joining! We\'ll be in touch soon.' 
    }
  }
}

/**
 * Load HubSpot Forms embed script
 * Use this if you prefer HubSpot's embed widget over API
 */
export function loadHubSpotFormsScript() {
  if (document.getElementById('hubspot-forms-script')) {
    return // Already loaded
  }

  const script = document.createElement('script')
  script.id = 'hubspot-forms-script'
  script.src = 'https://js.hsforms.net/forms/v2.js'
  script.async = true
  document.body.appendChild(script)
}

/**
 * Create HubSpot form embed
 * @param {string} formId - HubSpot form ID
 * @param {string} targetId - DOM element ID to embed form in
 */
export function createHubSpotFormEmbed(formId, targetId) {
  if (!window.hbspt) {
    loadHubSpotFormsScript()
    // Wait for script to load
    const checkInterval = setInterval(() => {
      if (window.hbspt) {
        clearInterval(checkInterval)
        window.hbspt.forms.create({
          portalId: HUBSPOT_PORTAL_ID,
          formId: formId,
          target: `#${targetId}`
        })
      }
    }, 100)
  } else {
    window.hbspt.forms.create({
      portalId: HUBSPOT_PORTAL_ID,
      formId: formId,
      target: `#${targetId}`
    })
  }
}


