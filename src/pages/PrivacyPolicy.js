import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styles, theme } from "../styles";
import { Button, Overlay, Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';


export default function PrivacyPolicy(props) {
    return (
        <Overlay isVisible={props.visible} onBackdropPress={() => props.updateVisible()} height="100%" width="100%" overlayStyle={{ padding: 0 }}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={[theme.colorGradientStart, theme.colorGradientEnd]}>
                <ScrollView style={[styles.bodyPadding]}>
                    <Icon name={'close'} color={"white"} type="material-community" size={40} containerStyle={{ alignSelf: "flex-end", top: theme.size(5), right: theme.size(5) }} onPress={() => props.updateVisible()} />
                    <Text style={[styles.bodyText, { textAlign: 'left', color: 'white' }]}>
                        Privacy Policy{"\n"}
                        {"\n"}
                        1.	About Your Privacy and This Privacy Policy
                        Your privacy is of outmost importance to us. Our team is constantly working to ensure that no resource or tool is spared and that the greatest emphasis is laid on protecting privacy of our clients. This document serves as our "Privacy Policy" and herein are details on issues related to your privacy when you avail any of our services. It is intended to inform you of our policies, procedures and practices regarding the collection, use and disclosure of any information that you provide through the Platform.
    The Privacy Policy is part of our Terms and Conditions which can be found in our website. The terms in the Privacy Policy (such as, but not limited to, "we", "our", “us", "Platform", “Counselor", "Counselor Services" etc) have the same meaning as in our Terms and Conditions document. When you use our Platform you accept and agree to both the Terms and Conditions and to the Privacy Policy. If you do not agree to be bound to the Privacy Policy you should stop using the Platform immediately. By accessing and using our Platform you affirm that you have read the Terms and Conditions and the Privacy Policy and that you understand, agree and acknowledge all the terms contained in both of them.{"\n"}
                        {"\n"}
                        2.	Information Collection, Use, and Disclosure
                        In order for us to operate the Platform effectively and ensure that you can use the Platform, including(but not limited to) the Counselor Services, we may have to collect your personally identifiable information (such as, but not limited to, your name, phone number, email address, and address), billing and payment information, profile information, log data (information such as your computer, Internet Protocol address (“IP”), pages that you visit and the amount of time spent on those pages, actions you take and other statistics), information related to the Counselor Services or your need for Counselor Services, and any information which is exchanged between you and your Counselor (collectively the "Information"). In some cases, some of the Information that you give to us is considered health related data. You may decide which Information, if any, you would like to share with us, but some functions of the Platform may not be available to you without providing us the necessary Information. By deciding to provide the Information you agree to our methods of collections and use, as well to other terms and provisions of this Privacy Policy.
                        Protecting this Information is our outmost priority. We will never sell or rent any Information you shared in the Platform. Other than in the limited ways detailed in this Privacy Policy, we will never use or disclose any Information unless you specifically and explicitly requested or approved us to do so
    The Information may be used for the following purposes:{"\n"}
                        o	To register and create your account on our Platform and ensure that you can log in to your account and use the Platform.{"\n"}
                        o	To manage your account, provide you with customer support, and ensure you are receiving services up to our quality standards.{"\n"}
                        o	To contact you or provide you with information, alerts and suggestions that are related to the service.{"\n"}
                        o	Billing-related purposes.{"\n"}
                        o	To reach out to you, either ourselves or using the appropriate authorities, if either we or a Counselor have a good reason to believe that you or any other person may be in danger or may be either the cause or the victim of a criminal act.{"\n"}
                        o	To appropriately match you with a Counselor.{"\n"}
                        o	To enable and facilitate the Counselor Services.{"\n"}
                        o	To supervise, administer and monitor the service.{"\n"}
                        o	To measure and improve the quality, the effectiveness and the delivery of our services.{"\n"}
                        {"\n"}
                        3.	Cookies and Web Beacons
    Like many websites, we use "cookies" and "web beacons" to collect information. A "cookie" is a small data file that is transferred to your computer's hard disk for record-keeping purposes. A "web beacon" is a tiny image, placed on a Web page or email that can report your visit or use. We use cookies and web beacons to enable the technical operation of the Platform, to administer your log-in to your account and to collect the Log Data. You can change your browser's settings so it will stop accepting cookies or to prompt you before accepting a cookie. However, if you do not accept cookies you may not be able to use the Platform. The Platform may also include the use of cookies and web beacons of services owned or provided by third parties that are not covered by our Privacy Policy and we do not have access or control over these cookies and web beacons. We may also use third party cookies for the purposes of web analytics, attribution and error management.{"\n"}
                        {"\n"}
                        4.	Social and General Information Tools
    We use several publicly-available tools and information exchange resources, such as (but not limited to) a blog, a Facebook page, a Twitter account, and others (collectively "Social and General Information Tools"). Any information you provide or share while using Social and General Information Tools may be read, accessed, and collected by that site and users of that site according to their Privacy Policy.{"\n"}
                        {"\n"}
                        5.	Phishing
    Online identity theft and account hacking, including the practice currently known as "phishing", are of great concern. You should always be diligent when you are being asked for your account information and you must always make sure you do that in our secure system. We will never request your login information or your credit card information in any non-secure or unsolicited communication (email, phone or otherwise).{"\n"}
                        {"\n"}
                        6.	Links
    The Platform may contain links to other websites, services or offers which are owned, operated or maintained by third parties. If you click on a third party link, you will be directed to that third website or service. The fact that we link to a website or service is not an endorsement, authorization or representation of our affiliation with that third party, nor is it an endorsement of their privacy or information security policies or practices. We do not have control over third party websites and services and we do not have control over their privacy policies and terms of use.{"\n"}
                        {"\n"}
                        7.	Security
    While using any Internet-based service carries inherent security risks that cannot be 100% prevented, our systems, infrastructure, encryption technology, operation and processes are all designed, built and maintained with your security and privacy in mind. We apply industry standards and best practices to prevent any unauthorized access, use, and disclosure. We comply with or exceed all applicable federal laws, state laws, and regulations regarding data privacy.{"\n"}
                        {"\n"}
                        8.	Service Providers
    We may employ third party companies and individuals to facilitate our Platform, to perform certain tasks which are related to the Platform, or to provide audit, legal, operational or other services for us. These tasks include, but not limited to, customer service, technical maintenance, monitoring, email management and communication, database management, billing and payment processing, reporting and analytics. We will share with them only the minimum necessary information to perform their task for us and only after entering into appropriate confidentiality agreements.{"\n"}
                        {"\n"}
                        9.	Children's Privacy
    We do not knowingly collect or solicit any information from anyone under the age of 13 or knowingly allow such persons to become our user. The Platform is not directed and not intended to be used by children under the age of 13. If you're aware that we have collected Personal Information from a child under age 13 please let us know by contacting us and we will delete that information.{"\n"}
                        {"\n"}
                        10.	International Transfer
    Your information may be transferred to — and maintained on — computers located inside our state. Regardless of where your data is stored, it will be maintained securely as outlined in this policy. Your consent to our Terms and Conditions followed by your submission of such information represents your agreement to such transfers.{"\n"}
                        {"\n"}
                        11.	Compliance with Laws and Law Enforcement
    We cooperate with government and law enforcement officials to enforce and comply with the law. We may be required to disclose information necessary or appropriate to protect the safety of the public or any person, to respond to claims and legal process (including but not limited to subpoenas), and to prevent or stop activity that may be illegal or dangerous. You should also be aware that Counselors may be obliged to disclose information to law enforcement or other authorities to conform to their professional and legal responsibilities and ethical standards. Specifically, and without limitation, you should be aware that the law requires mental health professionals to disclose information and/or take action in the following cases: (a) reported or suspected abuse of a child or vulnerable adult; (b) serious suicidal potential; (c) threatened harm to another person; (d) court-ordered presentation of treatment.{"\n"}
                        {"\n"}
                        12.	General Data Protection Regulation (GDPR) Notice
    This section provides additional information about our Privacy Policy relevant to users from the European Union. It is necessary for us to use your personal information:{"\n"}
                        o	To perform our obligations in accordance with any contract that we may have with you.{"\n"}
                        o	It is in our legitimate interest or a third party's legitimate interest to use personal information in such a way to ensure that we provide the Services in the best way that we can.{"\n"}
                        o	It is our legal obligation to use your personal information to comply with any legal obligations imposed upon us.{"\n"}
                        You can view and edit any personal data that you have provided to us using this App. Automated processing of your Personal Information is necessary to operate the Platform effectively and to provide counseling and related services.
    Pukaar is the Controller with respect to your Personal Data. You can contact our Data Protection Officer with questions, concerns or objections about this policy, or about your data by writing to:{"\n"}
                        Pukaarcommunity@gmail.com{"\n"}
                        Lahore, Pakistan{"\n"}
                        {"\n"}
                        13.	Changes to the Privacy Policy
    We may update this privacy statement at our sole discretion. The date of the last revision of this policy appears at the end of this page. We encourage you to periodically review this page for the latest information on our Privacy Policy and practices. Regardless of changes to our Privacy Policy, we will never use the information you submit under our current privacy notice in a new way without first notifying you and giving you the option to opt out.{"\n"}
                        {"\n"}
                        14.	Contacting us
    If you have any questions or concerns about this Privacy Policy or our privacy-related practices, please contact us by clicking the "Contact" link in our menu on our app or social media.{"\n"}{"\n"}
                        Last Updated: November- 2018
                        {"\n"}
                    </Text>
                </ScrollView>
            </LinearGradient>
        </Overlay>
    )
}