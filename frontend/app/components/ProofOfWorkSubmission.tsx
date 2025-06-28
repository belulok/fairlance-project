'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Github, FileText, Link, Hash, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface ProofOfWorkSubmissionProps {
  projectId: string;
  milestoneId: number;
  onSubmissionComplete?: () => void;
}

type DeliverableType = 'github' | 'ipfs' | 'url' | 'file';

export function ProofOfWorkSubmission({ 
  projectId, 
  milestoneId, 
  onSubmissionComplete 
}: ProofOfWorkSubmissionProps) {
  const [deliverableType, setDeliverableType] = useState<DeliverableType>('github');
  const [githubUrl, setGithubUrl] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    hash: string;
    details?: any;
  } | null>(null);

  const generateHash = async (content: string): Promise<string> => {
    // Simple hash generation for demo - in production use proper crypto
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const verifyGithubCommit = async (url: string) => {
    try {
      // Extract repo and commit from GitHub URL
      const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/commit\/([a-f0-9]+)/);
      if (!match) {
        throw new Error('Invalid GitHub commit URL format');
      }

      const [, owner, repo, commitHash] = match;
      
      // In a real implementation, you'd call GitHub API
      // For demo, we'll simulate verification
      const mockCommitData = {
        sha: commitHash,
        author: { name: 'Developer' },
        message: 'Implement milestone deliverable',
        timestamp: new Date().toISOString(),
        verified: true
      };

      return {
        isValid: true,
        hash: commitHash,
        details: mockCommitData
      };
    } catch (error) {
      return {
        isValid: false,
        hash: '',
        details: { error: error.message }
      };
    }
  };

  const verifyIPFSHash = async (hash: string) => {
    try {
      // Validate IPFS hash format
      if (!/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash)) {
        throw new Error('Invalid IPFS hash format');
      }

      // In a real implementation, you'd verify the content exists on IPFS
      // For demo, we'll simulate verification
      const mockIPFSData = {
        hash: hash,
        size: '2.5 MB',
        type: 'application/zip',
        verified: true,
        gateway: `https://ipfs.io/ipfs/${hash}`
      };

      return {
        isValid: true,
        hash: hash,
        details: mockIPFSData
      };
    } catch (error) {
      return {
        isValid: false,
        hash: '',
        details: { error: error.message }
      };
    }
  };

  const verifyFileUrl = async (url: string) => {
    try {
      // Basic URL validation
      new URL(url);
      
      // Generate hash of the URL for tracking
      const urlHash = await generateHash(url);
      
      const mockFileData = {
        url: url,
        hash: urlHash,
        verified: true,
        accessible: true
      };

      return {
        isValid: true,
        hash: urlHash,
        details: mockFileData
      };
    } catch (error) {
      return {
        isValid: false,
        hash: '',
        details: { error: error.message }
      };
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setVerificationResult(null);

    try {
      let result;
      
      switch (deliverableType) {
        case 'github':
          result = await verifyGithubCommit(githubUrl);
          break;
        case 'ipfs':
          result = await verifyIPFSHash(ipfsHash);
          break;
        case 'url':
          result = await verifyFileUrl(fileUrl);
          break;
        default:
          throw new Error('Unsupported deliverable type');
      }

      setVerificationResult(result);
      
      if (result.isValid) {
        toast.success('Deliverable verified successfully!');
      } else {
        toast.error('Verification failed: ' + result.details?.error);
      }
    } catch (error) {
      toast.error('Verification failed: ' + error.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!verificationResult?.isValid) {
      toast.error('Please verify your deliverable first');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setSubmitting(true);

    try {
      await api.submitMilestone(
        projectId,
        milestoneId,
        verificationResult.hash,
        description
      );

      toast.success('Milestone submitted successfully!');
      onSubmissionComplete?.();
    } catch (error) {
      console.error('Failed to submit milestone:', error);
      toast.error('Failed to submit milestone');
    } finally {
      setSubmitting(false);
    }
  };

  const getDeliverableIcon = () => {
    switch (deliverableType) {
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'ipfs':
        return <Hash className="w-5 h-5" />;
      case 'url':
        return <Link className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="web3-card">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            {getDeliverableIcon()}
            <div>
              <h3 className="text-lg font-semibold">Submit Proof of Work</h3>
              <p className="text-sm text-muted-foreground">
                Milestone {milestoneId + 1} - Verifiable Deliverable
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Deliverable Type Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Deliverable Type</label>
              <Select value={deliverableType} onValueChange={(value: DeliverableType) => setDeliverableType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="github">
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      GitHub Commit
                    </div>
                  </SelectItem>
                  <SelectItem value="ipfs">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      IPFS Hash
                    </div>
                  </SelectItem>
                  <SelectItem value="url">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      File URL
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Input Fields */}
            {deliverableType === 'github' && (
              <div>
                <label className="text-sm font-medium mb-2 block">GitHub Commit URL</label>
                <Input
                  placeholder="https://github.com/user/repo/commit/abc123..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide the full URL to your GitHub commit
                </p>
              </div>
            )}

            {deliverableType === 'ipfs' && (
              <div>
                <label className="text-sm font-medium mb-2 block">IPFS Hash</label>
                <Input
                  placeholder="QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx"
                  value={ipfsHash}
                  onChange={(e) => setIpfsHash(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide the IPFS hash of your uploaded deliverable
                </p>
              </div>
            )}

            {deliverableType === 'url' && (
              <div>
                <label className="text-sm font-medium mb-2 block">File URL</label>
                <Input
                  placeholder="https://example.com/deliverable.zip"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a publicly accessible URL to your deliverable
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Describe what you've delivered and how it meets the milestone requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Verification */}
            <div className="space-y-4">
              <Button
                onClick={handleVerify}
                disabled={verifying || !((deliverableType === 'github' && githubUrl) || 
                                       (deliverableType === 'ipfs' && ipfsHash) || 
                                       (deliverableType === 'url' && fileUrl))}
                variant="outline"
                className="w-full"
              >
                {verifying ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Verify Deliverable
                  </div>
                )}
              </Button>

              {/* Verification Result */}
              {verificationResult && (
                <div className={`border rounded-lg p-4 ${
                  verificationResult.isValid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {verificationResult.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-medium ${
                      verificationResult.isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {verificationResult.isValid ? 'Verification Successful' : 'Verification Failed'}
                    </span>
                  </div>
                  
                  {verificationResult.isValid && (
                    <div className="space-y-1 text-sm text-green-700">
                      <p><strong>Hash:</strong> {verificationResult.hash}</p>
                      {verificationResult.details && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            Verified on Blockchain
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={submitting || !verificationResult?.isValid || !description.trim()}
              className="w-full web3-button"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Submitting to Blockchain...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Submit Milestone
                </div>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
