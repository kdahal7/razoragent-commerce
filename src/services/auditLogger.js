// Real-time Audit Telemetry Logger for Agentic Commerce

class AuditLogger {
  constructor() {
    this.logs = [];
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.logs));
  }

  log({ type, title, details, status = "info", agentId = "RazorAgent-Core", payload = null, explainability = null }) {
    const entry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      displayTime: new Date().toLocaleTimeString(),
      type, // 'DISCOVERY', 'POLICY_CHECK', 'SAFETY_GATE', 'RAZORPAY_API', 'FAILURE_RECOVERY', 'UPSALE'
      title,
      details,
      status, // 'success', 'warning', 'error', 'info'
      agentId,
      payload,
      explainability,
    };

    this.logs.unshift(entry); // Newest first
    this.notify();
    return entry;
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
    this.notify();
  }
}

export const auditLogger = new AuditLogger();
