import { useState } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Card } from '~/components/ui/card'

const register = () => {
    const [formData, setFormData] = useState({
        email: ''
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle registration logic here
    } 
    return (
        <div className="min-h-screen flex">
            
        </div>
    )
}

export default register