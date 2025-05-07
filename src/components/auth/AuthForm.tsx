
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from "zod";

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form validation schemas
  const registerSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    studentId: z.string().min(5, { message: "Student ID must be at least 5 characters" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  });

  const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  });

  const validateForm = () => {
    setErrors({});
    
    try {
      if (mode === 'register') {
        registerSchema.parse({ name, email, studentId, password });
      } else {
        loginSchema.parse({ email, password });
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('registeredVoters') || '[]');
      
      if (mode === 'login') {
        // Check if user exists
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          // Check if user is verified
          if (!user.verified) {
            toast({
              title: "Account Not Verified",
              description: "Your account is pending verification. Please contact an administrator.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          // Store logged in user
          localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            studentId: user.studentId,
            verified: user.verified
          }));
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${user.name}!`,
          });
          
          navigate('/dashboard');
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password.",
            variant: "destructive",
          });
        }
      } else {
        // Check if email already exists
        if (users.some((u: any) => u.email === email)) {
          toast({
            title: "Registration Failed",
            description: "This email is already registered.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Check if student ID already exists
        if (users.some((u: any) => u.studentId === studentId)) {
          toast({
            title: "Registration Failed",
            description: "This student ID is already registered.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Create new user
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          studentId,
          password,
          verified: false, // New users need to be verified by admin
        };
        
        // Add to storage
        const updatedUsers = [...users, newUser];
        localStorage.setItem('registeredVoters', JSON.stringify(updatedUsers));
        
        toast({
          title: "Registration Successful",
          description: "Your account has been created and is pending verification.",
        });
        
        navigate('/login');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {mode === 'login' ? 'Login to VoteSphere' : 'Create an Account'}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === 'login'
            ? 'Enter your credentials to access your account'
            : 'Register to participate in student elections'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  placeholder="S12345"
                  className={errors.studentId ? "border-red-500" : ""}
                />
                {errors.studentId && <p className="text-red-500 text-sm">{errors.studentId}</p>}
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@university.edu"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={mode === 'login' ? '••••••••' : 'Min. 8 characters'}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-election-purple to-election-dark-purple hover:opacity-90"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'login' ? 'Logging in...' : 'Registering...'}
              </span>
            ) : (
              <span>{mode === 'login' ? 'Login' : 'Register'}</span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <Link to="/register" className="text-election-purple hover:underline">
                Register here
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-election-purple hover:underline">
                Login here
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
