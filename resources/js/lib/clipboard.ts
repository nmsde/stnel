import { useState } from 'react';

/**
 * Cross-browser clipboard copy utility
 * Handles both modern clipboard API and fallback methods
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        // Try modern clipboard API first (works in HTTPS and localhost)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers or non-HTTPS environments
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            textArea.remove();
            
            if (!successful) {
                throw new Error('Copy command was unsuccessful');
            }
            
            return true;
        }
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
}

/**
 * Hook for managing copy state and functionality
 */
export function useCopyToClipboard() {
    const [copied, setCopied] = useState<string | boolean>(false);

    const copy = async (text: string, id?: string) => {
        const success = await copyToClipboard(text);
        
        if (success) {
            setCopied(id || true);
            setTimeout(() => setCopied(false), 2000);
        } else {
            // Show user-friendly fallback message
            const userMessage = 'Copy failed. Please manually select and copy the text.';
            if (window.confirm(userMessage + ' Press OK to select the text.')) {
                // Try to help user select the text
                const selection = window.getSelection();
                if (selection) {
                    selection.selectAllChildren(document.body);
                }
            }
        }
        
        return success;
    };

    return { copied, copy };
}

// For non-React usage
export { copyToClipboard as copy };