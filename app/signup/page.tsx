const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState({
    uppercase: 0,
    lowercase: 0,
    numbers: 0,
    special: 0,
    length: 0
  })
  const router = useRouter()

  // Validate full name (only letters and spaces)
  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]+$/
    if (!name) {
      setNameError("Name is required")
      return false
    }
    if (!nameRegex.test(name)) {
      setNameError("Name can only contain letters and spaces (no numbers or special characters)")
      return false
    }
    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters long")
      return false
    }
    setNameError(null)
    return true
  }

  // Validate password strength
  const validatePassword = (password: string): boolean => {
    const uppercase = (password.match(/[A-Z]/g) || []).length
    const lowercase = (password.match(/[a-z]/g) || []).length
    const numbers = (password.match(/[0-9]/g) || []).length
    const special = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length
    const length = password.length

    setPasswordStrength({ uppercase, lowercase, numbers, special, length })

    if (length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return false
    }
    if (uppercase < 2) {
      setPasswordError("Password must contain at least 2 uppercase letters")
      return false
    }
    if (lowercase < 2) {
      setPasswordError("Password must contain at least 2 lowercase letters")
      return false
    }
    if (numbers < 2) {
      setPasswordError("Password must contain at least 2 numbers")
      return false
    }
    if (special < 2) {
      setPasswordError("Password must contain at least 2 special characters")
      return false
    }
    setPasswordError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    // Validate name
    if (!validateName(formData.fullName)) {
      setIsLoading(false)
      return
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
            phone_number: formData.phone,
          },
        },
      })

      if (error) throw error

      router.push("/auth/signup-success")
    } catch (error: any) {
      console.error("[v0] Sign up error:", error)
      setError(error.message || "An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }
