import React from "react";

export default function page() {
  return (
    <div className="mx-auto max-w-3xl p-4 my-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        {`This privacy policy applies to the Manus Unitas app (hereby referred to
        as "Application") for mobile devices that was created by Matthew
        Yakligian (hereby referred to as "Service Provider") as a Commercial
        service. This service is intended for use "AS IS".`}
      </p>
      <br />
      <h1 className="text-xl font-bold">Information Collection and Use</h1>
      <p>
        Manus Unitas collects information when you use it. This
        information may include information such as
      </p>
      <ul>
        <li>{`Your device's Internet Protocol address (e.g. IP address)`}</li>
        <li>
          The pages of the website that you visit, the time and date of your
          visit, the time spent on those pages
        </li>
        <li>
          The time spent on the software
        </li>
        <li>
          The operating system you use
        </li>
      </ul>
      <br />
      <p>
        Manus Unitas does not gather precise information about the location
        of your device.
      </p>
      <div style={{
        display: "none"
      }}>
        <p>
          {`Manus Unitas collects your device's approximate location, which helps the
          Service Provider determine your approximate geographical location and
          make use of in below ways:`}
        </p>
        <ul>
          <li>
            Geolocation Services: Manus Unitas utilizes location data to
            provide features such as personalized content, relevant
            recommendations, and location-based services.
          </li>
          <li>
            Analytics and Improvements: Aggregated and anonymized location data
            helps Manus Unitas to analyze user behavior, identify
            trends, and improve the overall performance and functionality of the
            Application.
          </li>
          <li>
            Third-Party Services: Periodically, Manus Unitas may
            transmit anonymized location data to external services. These
            services assist them in enhancing Manus Unitas and optimizing
            their offerings.
          </li>
        </ul>
      </div>
      <br />
      <p>
        Manus Unitas may use the information you provided to contact you
        from time to time to provide you with important information, required
        notices and marketing promotions.
      </p>
      <br />
      <p>
        For a better experience, while using Manus Unitas, the Service
        Provider may require you to provide us with certain personally
        identifiable information, including but not limited to an email,
        phone number, full name, address. The information that Manus Unitas
        request will be retained by them and used as described in this
        privacy policy.
      </p>
      <br />
      <h1 className="text-xl font-bold">Third Party Access</h1>
      <p>
        Only aggregated, anonymized data is periodically transmitted to external
        services to aid Manus Unitas in improving the website and
        their service. Manus Unitas may share your information with
        third parties in the ways that are described in this privacy statement.
      </p>
      <div>
        <br />
        <p>
          Please note that Manus Unitas utilizes third-party services that
          have their own Privacy Policy about handling data. Below are the links
          to the Privacy Policy of the third-party service providers used:
        </p>
        <ul>
          <li>
            <a
              href="https://firebase.google.com/support/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics for Firebase
            </a>
          </li>
        </ul>
      </div>
      <br />
      <p>
        Manus Unitas may disclose User Provided and Automatically
        Collected Information:
      </p>
      <ul>
        <li>
          as required by law, such as to comply with a subpoena, or similar
          legal process;
        </li>
        <li>
          when they believe in good faith that disclosure is necessary to
          protect their rights, protect your safety or the safety of others,
          investigate fraud, or respond to a government request;
        </li>
        <li>
          with their trusted services providers who work on their behalf, do not
          have an independent use of the information we disclose to them, and
          have agreed to adhere to the rules set forth in this privacy
          statement.
        </li>
      </ul>
      <p></p>
      <br />
      <h1 className="text-xl font-bold">Opt-Out Rights</h1>
      <p>
        You can stop all collection of information by the program by requesting a
        deletion of your account at /contact
      </p>
      <br />
      <h1 className="text-xl font-bold">Data Retention Policy</h1>
      <p>
        {`Manus Unitas will retain User Provided data for as long as you
        use the website and for a reasonable time thereafter. If you'd like
        them to delete User Provided Data that you have provided via the
        Application, please contact them at `}<a href="mailto:info@manusunitas.com">info@manusunitas.com</a> and they will
        respond in a reasonable time.
      </p>
      <br />
      <h1 className="text-xl font-bold">Children</h1>
      <p>
        Manus Unitas does not use the program to knowingly solicit
        data from or market to children under the age of 13.
      </p>
      <div>
        <br />
        <p>
          Manus Unitas does not address anyone under the age of 13. The
          Service Provider does not knowingly collect personally identifiable
          information from children under 13 years of age. In the case the
          Service Provider discover that a child under 13 has provided personal
          information, Manus Unitas will immediately delete this from
          their servers. If you are a parent or guardian and you are aware that
          your child has provided us with personal information, please contact
          Manus Unitas (<a href="mailto:info@manusunitas.com">info@manusunitas.com</a>) so that they will be able
          to take the necessary actions.
        </p>
      </div>
      <br />
      <h1 className="text-xl font-bold">Security</h1>
      <p>
        Manus Unitas is concerned about safeguarding the confidentiality
        of your information. Manus Unitas provides physical, electronic,
        and procedural safeguards to protect information Manus Unitas
        processes and maintains.
      </p>
      <br />
      <h1 className="text-xl font-bold">Changes</h1>
      <p>
        This Privacy Policy may be updated from time to time for any reason. The
        Service Provider will notify you of any changes to the Privacy Policy by
        updating this page with the new Privacy Policy. You are advised to
        consult this Privacy Policy regularly for any changes, as continued use
        is deemed approval of all changes.
      </p>
      <br />
      <p>This privacy policy is effective as of 2024-04-25</p>
      <br />
      <h1 className="text-xl font-bold">Your Consent</h1>
      <p>
        By using the application, you are consenting to the processing of your
        information as set forth in this Privacy Policy now and as amended by
        us.
      </p>
      <br />
      <h1 className="text-xl font-bold">Contact Us</h1>
      <p>
        If you have any questions regarding privacy while using Manus Unitas,
        or have questions about the practices, please contact us via email at
        <a href="mailto:info@manusunitas.com">info@manusunitas.com</a>.
      </p>
    </div>
  );
}
