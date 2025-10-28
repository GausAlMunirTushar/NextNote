"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Copy,
  Download,
  Mail,
  Share2,
  Users,
  Globe,
  Lock,
  Check,
  Link2,
} from "lucide-react";

interface ShareNoteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  onCopyLink: () => void;
  documentId?: string;
}

export default function ShareNote({ 
  open, 
  onOpenChange, 
  title, 
  content, 
  onCopyLink,
  documentId 
}: ShareNoteProps) {
  const [shareSettings, setShareSettings] = useState({
    public: false,
    allowComments: true,
    allowDuplication: false,
  });
  const [copied, setCopied] = useState(false);

  // Use environment-based URL or fallback
  const getShareUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nextnote.app';
    const docId = documentId || 'new-document';
    return `${baseUrl}/share/${docId}`;
  };

  const shareUrl = getShareUrl();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopyLink();
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareSettingsChange = (key: keyof typeof shareSettings, value: boolean) => {
    setShareSettings(prev => ({ ...prev, [key]: value }));
  };

  const exportAsText = () => {
    const blob = new Blob([`# ${title}\n\n${content.replace(/<[^>]*>/g, '')}`], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'untitled'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title || "Check out this note");
    const body = encodeURIComponent(`Title: ${title}\n\nContent: ${content.replace(/<[^>]*>/g, '')}\n\nView it here: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Share2 className="h-5 w-5" />
            Share this note
          </DialogTitle>
          <DialogDescription className="text-sm">
            Collaborate with others by sharing this document
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Link Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Shareable link</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="h-10 text-sm font-mono bg-muted/50"
              />
              <Button 
                onClick={handleCopyLink} 
                size="sm" 
                className="h-10 px-4"
                variant={copied ? "default" : "outline"}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can {shareSettings.public ? 'view' : 'access'} this document
            </p>
          </div>

          {/* Quick Share Options */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="h-9" onClick={handleCopyLink}>
              <Link2 className="h-4 w-4 mr-2" />
              Copy link
            </Button>
            <Button variant="outline" size="sm" className="h-9" onClick={exportAsText}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="h-9" onClick={shareViaEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>

          {/* Share Settings */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${shareSettings.public ? 'bg-blue-500/10 text-blue-600' : 'bg-muted'}`}>
                  {shareSettings.public ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="public-sharing" className="text-sm font-medium cursor-pointer">
                    {shareSettings.public ? 'Public access' : 'Private access'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {shareSettings.public 
                      ? 'Anyone with the link can view' 
                      : 'Only people with access can view'
                    }
                  </p>
                </div>
              </div>
              <Switch
                id="public-sharing"
                checked={shareSettings.public}
                onCheckedChange={(checked) => handleShareSettingsChange('public', checked)}
              />
            </div>

            {shareSettings.public && (
              <div className="space-y-3 ml-11">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-comments" className="text-sm">Allow comments</Label>
                    <p className="text-xs text-muted-foreground">
                      People can comment on this document
                    </p>
                  </div>
                  <Switch
                    id="allow-comments"
                    checked={shareSettings.allowComments}
                    onCheckedChange={(checked) => handleShareSettingsChange('allowComments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-duplication" className="text-sm">Allow duplication</Label>
                    <p className="text-xs text-muted-foreground">
                      People can make copies of this document
                    </p>
                  </div>
                  <Switch
                    id="allow-duplication"
                    checked={shareSettings.allowDuplication}
                    onCheckedChange={(checked) => handleShareSettingsChange('allowDuplication', checked)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Access Management */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">People with access</Label>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Users className="h-3 w-3 mr-1" />
                Invite people
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    Y
                  </div>
                  <span className="text-sm">You</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Owner
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              size="sm"
            >
              Close
            </Button>
            <Button onClick={handleCopyLink} size="sm">
              {copied ? 'Copied!' : 'Copy link'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}