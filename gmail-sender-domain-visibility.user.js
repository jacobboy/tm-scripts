// ==UserScript==
// @name         Gmail Sender & Header Visibility Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhance visibility of sender information and highlight unknown senders
// @author       You
// @match        https://mail.google.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    console.log('Gmail Header Enhancer: Script loaded');

    // ===== CONFIGURE YOUR KNOWN DOMAINS HERE =====
    const knownDomains = [
        'jira.com',
        'github.com',
        'noom.com',
        // Add more trusted domains
    ];
    // ============================================

    // Wait for Gmail to load
    function init() {
        console.log('Gmail Header Enhancer: init');
        if (document.readyState === 'loading') {
            console.log('Gmail Header Enhancer: event listener');
            document.addEventListener('DOMContentLoaded', applyStyles);
        } else {
            applyStyles();
        }
    }

    function applyStyles() {
        console.log('Gmail Header Enhancer: begin apply styles');
        const style = document.createElement('style');
        style.id = 'gmail-header-enhancer';
        style.textContent = `

            /* === OPENED EMAIL: Make sender email HIGHLY visible === */
            .go {
                font-size: 18px !important;
                font-weight: bold !important;
                display: inline-block !important;
                color: #1a73e8 !important;
                background: #e8f0fe !important;
                padding: 4px 8px !important;
                border-radius: 4px !important;
                margin-left: 8px !important;
            }

            /* Make sender email RED when from unknown domain */
            .go.unknown-domain-sender {
                color: #d93025 !important;
                background: #fce8e6 !important;
            }

            /* Make the sender name red for unknown domains */
            tr.zA.unknown-domain-email .yP[email] {
                color: #d93025 !important;
                font-weight: bold !important;
            }
        `;

        // Remove old style if exists
        const oldStyle = document.getElementById('gmail-header-enhancer');
        if (oldStyle) {
            oldStyle.remove();
        }

        // Add new style
        document.head.appendChild(style);
        console.log('Gmail Header Enhancer: Styles applied');
    }
    
    // Check if an email address is from an unknown domain
    function isUnknownDomain(email) {
        if (!email) return false;
        const emailLower = email.toLowerCase();
        
        // Return true if NOT in known domains list
        return !knownDomains.some(domain => {
            return emailLower.includes('@' + domain.toLowerCase());
        });
    }

    // Highlight emails from unknown domains in list view
    function highlightUnknownSenders() {
        // Find all email rows
        const emailRows = document.querySelectorAll('tr.zA');
        
        let highlightedCount = 0;
        
        emailRows.forEach(row => {
            // Skip if already processed
            if (row.dataset.domainChecked) return;
            
            // Find the sender email within this row
            const senderSpan = row.querySelector('.yP[email]');
            
            if (senderSpan) {
                const senderEmail = senderSpan.getAttribute('email');
                
                if (isUnknownDomain(senderEmail)) {
                    row.classList.add('unknown-domain-email');
                    highlightedCount++;
                    console.log(`Gmail Header Enhancer: Highlighted email from ${senderEmail}`);
                }
                
                // Mark as processed
                row.dataset.domainChecked = 'true';
            }
        });
        
        if (highlightedCount > 0) {
            console.log(`Gmail Header Enhancer: Highlighted ${highlightedCount} emails from unknown domains`);
        }
    }

    // Check and highlight sender email in opened email
    function highlightOpenedEmailSender() {
        // Find sender email elements in opened emails
        const senderEmails = document.querySelectorAll('.go');
        
        senderEmails.forEach(emailElement => {
            // Skip if already checked
            if (emailElement.dataset.domainChecked) return;
            
            // Try to find the email address from the element's text or parent
            // The .go element typically contains the email like <user@domain.com>
            const emailText = emailElement.textContent.trim();
            
            // Extract email from angle brackets like <user@domain.com>
            const emailMatch = emailText.match(/<([^>]+)>/) || emailText.match(/([^\s<>]+@[^\s<>]+)/);
            
            if (emailMatch) {
                const email = emailMatch[1] || emailMatch[0];
                
                if (isUnknownDomain(email)) {
                    emailElement.classList.add('unknown-domain-sender');
                    console.log(`Gmail Header Enhancer: Marked opened email sender as unknown: ${email}`);
                }
                
                emailElement.dataset.domainChecked = 'true';
            }
        });
    }

    // Monitor for opened emails
    function monitorOpenedEmails() {
        // Wait for document.body to exist
        if (!document.body) {
            console.log('Gmail Header Enhancer: Waiting for document.body (opened emails)');
            setTimeout(monitorOpenedEmails, 100);
            return;
        }
        
        const observer = new MutationObserver(() => {
            highlightOpenedEmailSender();
        });
        
        // Start observing the entire document for email opens
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('Gmail Header Enhancer: Monitoring opened emails');
        
        // Initial check
        highlightOpenedEmailSender();
    }

    function monitorEmailList() {
        // Wait for document.body to exist
        if (!document.body) {
            console.log('Gmail Header Enhancer: Waiting for document.body (email list)');
            setTimeout(monitorEmailList, 100);
            return;
        }
        
        let isMonitoring = false;
        
        // Observer to watch for email list changes
        const listObserver = new MutationObserver(() => {
            highlightUnknownSenders();
        });
        
        // Observer to wait for Gmail to create the email list
        const initObserver = new MutationObserver(() => {
            const emailListContainer = document.querySelector('.AO');
            if (emailListContainer && !isMonitoring) {
                isMonitoring = true;
                
                console.log('Gmail Header Enhancer: Email list detected, starting monitoring');
                
                // Initial highlight
                highlightUnknownSenders();
                
                // Monitor for future changes
                listObserver.observe(emailListContainer, {
                    childList: true,
                    subtree: true
                });
                
                // Stop watching for the list to appear
                initObserver.disconnect();
            }
        });
        
        // Start watching the entire document for Gmail to load
        initObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    init();

    // Start monitoring after Gmail loads
    monitorEmailList();
    monitorOpenedEmails();

})();