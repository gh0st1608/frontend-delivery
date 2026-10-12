import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TrackingStatus } from "@/hooks/tracking/use-order-tracking";

const C = {
  bg: "#F5F5F5",
  card: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  accent: "#22C55E",
  accentSoft: "#DCFCE7",
  track: "#E5E7EB",
};

interface StepDef {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STEPS: StepDef[] = [
  { label: "Pago", icon: "card" },
  { label: "Repartidor", icon: "bicycle" },
  { label: "En camino", icon: "navigate" },
  { label: "Entregado", icon: "checkmark-done" },
];

// status del pedido -> paso actual (1..4) y textos del hero
function resolve(status: TrackingStatus, hasLocation: boolean) {
  if (status === "DELIVERED") {
    return { current: 4, delivered: true, title: "¡Pedido entregado!", subtitle: "Gracias por tu compra 🎉", icon: "checkmark-done" as const };
  }
  if (status === "TRACKING" || hasLocation) {
    return { current: 3, delivered: false, title: "Tu pedido está en camino", subtitle: "Sigue al repartidor en el mapa en tiempo real.", icon: "navigate" as const };
  }
  if (status === "ASSIGNED") {
    return { current: 2, delivered: false, title: "¡Repartidor asignado!", subtitle: "Obteniendo su ubicación…", icon: "bicycle" as const };
  }
  return { current: 1, delivered: false, title: "Buscando repartidor", subtitle: "Estamos asignando al repartidor más cercano.", icon: "search" as const };
}

export function TrackingWaiting({
  status,
  hasLocation = false,
}: {
  status: TrackingStatus;
  hasLocation?: boolean;
}) {
  const { current, delivered, title, subtitle, icon } = resolve(status, hasLocation);
  // El paso "actual" muestra spinner salvo cuando ya se entregó
  const active = delivered ? 0 : current;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seguimiento del pedido</Text>
      </View>

      <View style={styles.hero}>
        <View style={styles.badge}>
          {active ? (
            <ActivityIndicator
              size="large"
              color={C.accent}
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <View style={[styles.badgeInner, delivered && { backgroundColor: C.accent }]}>
            <Ionicons
              name={icon}
              size={34}
              color={delivered ? "#fff" : C.accent}
            />
          </View>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((step, i) => {
          const n = i + 1;
          const done = delivered ? true : n < current;
          const isActive = !delivered && n === current;
          return (
            <View key={step.label} style={styles.stepCol}>
              <View style={styles.stepRow}>
                {/* conector izquierdo */}
                <View style={[styles.connector, i === 0 && styles.connectorHidden, n <= current && styles.connectorOn]} />
                <View
                  style={[
                    styles.node,
                    (done || isActive) && styles.nodeOn,
                    isActive && styles.nodeActive,
                  ]}
                >
                  <Ionicons
                    name={done ? "checkmark" : step.icon}
                    size={14}
                    color={done || isActive ? "#fff" : C.muted}
                  />
                </View>
                {/* conector derecho */}
                <View style={[styles.connector, i === STEPS.length - 1 && styles.connectorHidden, n < current && styles.connectorOn]} />
              </View>
              <Text style={[styles.stepLabel, (done || isActive) && styles.stepLabelOn]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.hint}>
        <Ionicons name="information-circle-outline" size={18} color={C.muted} />
        <Text style={styles.hintText}>
          {delivered
            ? "Puedes ver el detalle de tu pedido en tu historial."
            : "Te mantendremos al tanto. Esta pantalla se actualiza sola."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 },

  header: { paddingTop: 20, paddingBottom: 8, alignItems: "center" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: C.text },

  hero: { flex: 1, justifyContent: "center", alignItems: "center", gap: 6 },
  badge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  badgeInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "800", color: C.text, textAlign: "center" },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 20,
  },

  stepper: { flexDirection: "row", marginBottom: 24 },
  stepCol: { flex: 1, alignItems: "center" },
  stepRow: { flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center" },
  connector: { flex: 1, height: 3, backgroundColor: C.track, borderRadius: 2 },
  connectorHidden: { backgroundColor: "transparent" },
  connectorOn: { backgroundColor: C.accent },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 2,
    borderColor: C.track,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeOn: { backgroundColor: C.accent, borderColor: C.accent },
  nodeActive: {
    backgroundColor: C.accent,
    borderColor: C.accentSoft,
  },
  stepLabel: { fontSize: 11.5, color: C.muted, marginTop: 6, fontWeight: "500" },
  stepLabelOn: { color: C.text, fontWeight: "700" },

  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 28,
  },
  hintText: { flex: 1, fontSize: 12.5, color: C.muted, lineHeight: 18 },
});
