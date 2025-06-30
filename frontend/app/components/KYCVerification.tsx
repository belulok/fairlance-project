'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface KYCStatus {
  status: 'not_started' | 'pending' | 'verified' | 'rejected';
  data?: any;
  trustScore?: number;
}

export function KYCVerification() {
  const [kycStatus, setKycStatus] = useState<KYCStatus>({ status: 'not_started' });
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(false);

  useEffect(() => {
    checkKYCStatus();
  }, []);

  const checkKYCStatus = async () => {
    try {
      setLoading(true);
      console.log('Checking KYC status...');

      // Check if user is authenticated
      const token = localStorage.getItem('fairlance_token');
      if (!token) {
        console.log('No auth token found, setting default status');
        setKycStatus({ status: 'not_started' });
        return;
      }

      const response = await api.getKYCStatus();
      console.log('KYC status response:', response);
      setKycStatus(response);
    } catch (error) {
      console.error('Failed to check KYC status:', error);
      // If user is not authenticated, set default status
      if (error.response?.status === 401) {
        setKycStatus({ status: 'not_started' });
      } else {
        toast.error('Failed to check KYC status');
      }
    } finally {
      setLoading(false);
    }
  };

  const initiateKYC = async () => {
    try {
      setInitiating(true);
      console.log('Initiating KYC verification...');

      // Check if user is authenticated
      const token = localStorage.getItem('fairlance_token');
      if (!token) {
        toast.error('Please log in to start KYC verification');
        return;
      }

      const response = await api.initiateKYC();
      console.log('KYC initiation response:', response);

      if (response.verificationUrl) {
        // Open KYC verification in new window
        window.open(response.verificationUrl, '_blank');
        toast.success('KYC verification initiated. Complete the process in the new window.');

        // Update status to pending
        setKycStatus({ status: 'pending' });

        // Poll for status updates
        const pollInterval = setInterval(async () => {
          try {
            const status = await api.getKYCStatus();
            setKycStatus(status);

            if (status.status === 'verified' || status.status === 'rejected') {
              clearInterval(pollInterval);
              if (status.status === 'verified') {
                toast.success('KYC verification completed successfully!');
              } else {
                toast.error('KYC verification was rejected. Please try again.');
              }
            }
          } catch (error) {
            console.error('Failed to poll KYC status:', error);
          }
        }, 5000);

        // Clear interval after 10 minutes
        setTimeout(() => clearInterval(pollInterval), 600000);
      } else if (response.success) {
        // Handle MasChain response format
        toast.success('KYC verification initiated successfully!');
        setKycStatus({ status: 'pending' });
      } else {
        // Demo mode - simulate KYC process
        toast.success('Demo: KYC verification initiated! Simulating verification process...');
        setKycStatus({ status: 'pending' });

        // Simulate verification completion after 3 seconds
        setTimeout(() => {
          setKycStatus({
            status: 'verified',
            trustScore: 95,
            data: {
              documentType: 'passport',
              verificationDate: new Date().toISOString()
            }
          });
          toast.success('Demo: KYC verification completed successfully!');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to initiate KYC:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate KYC verification';
      toast.error(errorMessage);
    } finally {
      setInitiating(false);
    }
  };

  const getStatusIcon = () => {
    switch (kycStatus.status) {
      case 'verified':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Shield className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (kycStatus.status) {
      case 'verified':
        return <Badge className="bg-green-500">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getStatusMessage = () => {
    switch (kycStatus.status) {
      case 'verified':
        return 'Your identity has been successfully verified. You can now access all platform features.';
      case 'pending':
        return 'Your KYC verification is being processed. This usually takes 1-2 business days.';
      case 'rejected':
        return 'Your KYC verification was rejected. Please contact support or try again with different documents.';
      default:
        return 'Complete KYC verification to unlock all platform features and increase your trust score.';
    }
  };

  if (loading) {
    return (
      <Card className="web3-card">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="web3-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <h3 className="text-lg font-semibold">KYC Verification</h3>
                <p className="text-sm text-muted-foreground">Identity Verification</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          <p className="text-muted-foreground mb-6">
            {getStatusMessage()}
          </p>

          {kycStatus.status === 'verified' && kycStatus.trustScore && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium text-green-800">Verification Complete</span>
              </div>
              <p className="text-sm text-green-700">
                Your trust score has been updated to <strong>{kycStatus.trustScore}</strong>
              </p>
            </div>
          )}

          {kycStatus.status === 'not_started' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Benefits of KYC Verification:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Increase your trust score by +10 points</li>
                  <li>• Access to premium projects</li>
                  <li>• Higher visibility in search results</li>
                  <li>• Eligibility for credit scoring features</li>
                </ul>
              </div>

              <Button 
                onClick={initiateKYC}
                disabled={initiating}
                className="w-full web3-button"
              >
                {initiating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Initiating Verification...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Start KYC Verification
                    <ExternalLink className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          )}

          {kycStatus.status === 'pending' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-yellow-800">Verification in Progress</span>
                </div>
                <p className="text-sm text-yellow-700">
                  We're reviewing your documents. You'll receive an email notification once the verification is complete.
                </p>
              </div>

              <Button 
                onClick={checkKYCStatus}
                variant="outline"
                className="w-full"
              >
                Check Status
              </Button>
            </div>
          )}

          {kycStatus.status === 'rejected' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-800">Verification Rejected</span>
                </div>
                <p className="text-sm text-red-700">
                  Your verification was rejected. Please ensure your documents are clear and valid, then try again.
                </p>
              </div>

              <Button 
                onClick={initiateKYC}
                disabled={initiating}
                className="w-full web3-button"
              >
                {initiating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Retrying Verification...
                  </div>
                ) : (
                  'Retry Verification'
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
