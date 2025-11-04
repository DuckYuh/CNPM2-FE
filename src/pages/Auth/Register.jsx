import { useState } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Card } from '~/components/ui/card'
import { Link, useNavigate } from 'react-router-dom'

const register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle registration logic here
    } 
    return (
        <div className="min-h-screen flex">
            {/* Left Instructions Side */}
            <div className="hidden lg:flex w-1/4 bg-mainColor1-500 p-12 text-primary-foreground flex-col justify-between">
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold">Welcome To Our Website!</h1>
                    <p className="text-lg">Register new account and manage your services.</p>
                    
                    <div className="space-y-4 mt-8">
                        <h2 className="text-2xl font-semibold">Quick Instructions:</h2>
                        <ul className="space-y-2 list-disc list-inside">
                            <li>Enter your username</li>
                            <li>Enter your email address</li>
                            <li>Enter your password</li>
                            <li>Contact support if you need help</li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-auto">
                    <p className="text-sm opacity-80">
                        © 2024 Master Data. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Registration Form Side */}
            <div className="w-full lg:w-3/4 flex items-center justify-center p-8 bg-mainBg-500">
                <Card className="w-full max-w-md p-8 space-y-6">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold">Register</h2>
                        <p className="text-muted-foreground">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input 
                                id="username"
                                type="username" 
                                placeholder="username"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email"
                                type="email" 
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full bg-mainColor1-500">
                            Sign up
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default register