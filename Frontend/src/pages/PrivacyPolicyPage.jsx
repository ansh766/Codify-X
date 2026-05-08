import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-[#ffffff] dark:bg-[#232b3b] rounded-xl p-8 md:p-12 border border-[#e2e8f0] dark:border-[#334155]">
                <article className="max-w-none">
                    <h1 className="text-4xl font-extrabold text-[#1e293b] dark:text-[#e2e8f0] mb-2">Privacy Policy</h1>
                    <p className="text-sm text-[#667085] dark:text-[#94a3b8] mb-8">
                        Last Updated: {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">1. Introduction</h2>
                    <p className="text-[#475569] dark:text-[#94a3b8] mb-4">
                        Welcome to CodifyX ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, including our website and services (collectively, the "Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">2. Information We Collect</h2>
                    <p className="text-[#475569] dark:text-[#94a3b8] mb-4">We collect information that you provide directly to us, information we collect automatically when you use our Service, and information from third-party sources.</p>

                    <h3 className="text-xl font-semibold text-[#1e293b] dark:text-[#e2e8f0] mt-6 mb-2">Information You Provide to Us</h3>
                    <ul className="list-disc list-inside space-y-2 text-[#475569] dark:text-[#94a3b8] mb-4">
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Account Information:</strong> When you register for an account, we collect your name, email address, and password (which is hashed). If you register using a third-party service like Google or GitHub, we collect information provided by that service, such as your name, email, and public profile information.</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Profile Information:</strong> You may choose to provide additional information for your user profile, such as a profile picture.</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">User Content:</strong> We collect the content you create and upload to the Service. This includes your code submissions, comments, notes on submissions, and problems you add to custom "sprints."</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">AI Tutor Communications:</strong> When you interact with our AI Tutor, we collect the queries and code snippets you provide to the service to facilitate responses.</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Communications:</strong> If you contact us directly, we may receive additional information about you, such as your name, email address, the contents of the message, and/or attachments you may send us.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-[#1e293b] dark:text-[#e2e8f0] mt-6 mb-2">Information We Collect Automatically</h3>
                    <ul className="list-disc list-inside space-y-2 text-[#475569] dark:text-[#94a3b8] mb-4">
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Log and Usage Data:</strong> Our servers automatically record information when you use the Service, including your IP address, browser type, operating system, pages visited, access times, and referring website addresses.</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Cookies and Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Service and hold certain information.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">3. How We Use Your Information</h2>
                    <p className="text-[#475569] dark:text-[#94a3b8] mb-2">We use the information we collect for various purposes, including to:</p>
                    <ul className="list-disc list-inside space-y-2 text-[#475569] dark:text-[#94a3b8] mb-4">
                        <li>Provide, operate, and maintain our Service.</li>
                        <li>Create and manage your account.</li>
                        <li>Execute your code securely using our third-party code execution engine (Judge0).</li>
                        <li>Provide AI-powered guidance and analysis through our integration with the Google GenAI SDK.</li>
                        <li>Improve, personalize, and expand our Service.</li>
                        <li>Understand and analyze how you use our Service.</li>
                        <li>Communicate with you for customer service, updates, and marketing purposes.</li>
                        <li>Enhance the security of our Service.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">4. How We Share Your Information</h2>
                    <p className="text-[#475569] dark:text-[#94a3b8] mb-2">We do not sell your personal information. We may share information in certain situations:</p>
                    <ul className="list-disc list-inside space-y-2 text-[#475569] dark:text-[#94a3b8] mb-4">
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Third-Party Service Providers:</strong> We share information with vendors such as Judge0, Google, Cloudinary, and Razorpay only as necessary for them to perform their functions.</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Publicly Shared Information:</strong> Your username and certain activity, such as your leaderboard rank, may be visible to other users.</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Legal Obligations:</strong> We may disclose your information if required by law or valid public authority requests.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">5. Advertising and Analytics</h2>
                    <p className="text-[#475569] dark:text-[#94a3b8] mb-2">To support our Service, we may use third-party advertising services like Google AdSense.</p>
                    <ul className="list-disc list-inside space-y-2 text-[#475569] dark:text-[#94a3b8] mb-4">
                        <li>Third-party vendors, including Google, use cookies to serve ads based on prior visits to our website.</li>
                        <li>
                            You may opt out of personalized advertising by visiting Google's{' '}
                            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline">
                                Ads Settings
                            </a> or{' '}
                            <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#f97316] hover:underline">
                                www.aboutads.info/choices
                            </a>.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">6. Your Data Rights and Choices</h2>
                    <ul className="list-disc list-inside space-y-2 text-[#475569] dark:text-[#94a3b8] mb-4">
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Access:</strong> You have the right to access your personal data through your profile page.</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Correction:</strong> You can update or correct inaccuracies through your account settings.</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Deletion:</strong> You may request deletion of your account by contacting us.</li>
                        <li><strong className="text-[#1e293b] dark:text-[#e2e8f0]">Opt-Out:</strong> You may opt out of promotional emails via the unsubscribe link.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">7. Data Security</h2>
                    <p className="text-[#475569] dark:text-[#94a3b8] mb-4">
                        We use administrative, technical, and physical security measures to protect your personal information. We use bcrypt for hashing passwords and JWT for securing sessions. No security measures are perfect or impenetrable.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">8. Children's Privacy</h2>
                    <p className="text-[#475569] dark:text-[#94a3b8] mb-4">
                        Our Service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">9. Changes to This Privacy Policy</h2>
                    <p className="text-[#475569] dark:text-[#94a3b8] mb-4">
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                    </p>

                    <h2 className="text-2xl font-bold text-[#1e293b] dark:text-[#e2e8f0] mt-8 mb-3">10. Contact Us</h2>
                    <p className="text-[#475569] dark:text-[#94a3b8]">
                        If you have any questions about this Privacy Policy, please contact us at:{' '}
                        <a href="mailto:rastogiiansh9@gmail.com" className="text-[#f97316] hover:underline">
                            rastogiiansh9@gmail.com
                        </a>.
                    </p>
                </article>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;