import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';
import { getAttendanceHistoryAPI, updatePostAPI } from '@shared/api/schoolApi';
import { listClassesAPI } from '@shared/api/adminApi';
import { apiClient } from '@shared/api/apiClient';

const PERIODS = [
  { id: 'today', label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: 'week', label: 'Últimos 7 dias' },
  { id: 'month', label: 'Últimos 30 dias' },
];

export const AttendanceHistoryScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedTurmaId, setSelectedTurmaId] = useState('ALL');
  const [classes, setClasses] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PRESENT' | 'ABSENT'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    resumo: {
      totalRegistros: 0,
      totalPresentes: 0,
      totalFaltas: 0,
      taxaComparecimento: '0%',
    },
    registros: [],
  });

  // Calcula parâmetros de data baseado no chip selecionado
  const getDateParams = useCallback((periodId) => {
    const today = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];

    if (periodId === 'today') {
      return { data: formatDate(today) };
    }

    if (periodId === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      return { data: formatDate(yesterday) };
    }

    if (periodId === 'week') {
      const pastWeek = new Date();
      pastWeek.setDate(today.getDate() - 6);
      return {
        data_inicio: formatDate(pastWeek),
        data_fim: formatDate(today),
      };
    }

    if (periodId === 'month') {
      const pastMonth = new Date();
      pastMonth.setDate(today.getDate() - 29);
      return {
        data_inicio: formatDate(pastMonth),
        data_fim: formatDate(today),
      };
    }

    return { data: formatDate(today) };
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await listClassesAPI();
        setClasses(res?.data || (Array.isArray(res) ? res : []));
      } catch (e) {
        // fallback
      }
    };
    fetchClasses();
  }, []);

  const loadAttendanceHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = getDateParams(selectedPeriod);
      if (selectedTurmaId !== 'ALL') {
        params.turma_id = selectedTurmaId;
      }
      const res = await getAttendanceHistoryAPI(params);
      setData(res || { resumo: { totalRegistros: 0, totalPresentes: 0, totalFaltas: 0, taxaComparecimento: '0%' }, registros: [] });
    } catch (error) {
      console.error('Erro ao carregar histórico de presenças:', error);
      Alert.alert('Erro', error.message || 'Falha ao buscar histórico de presença.');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, selectedTurmaId, getDateParams]);

  useEffect(() => {
    loadAttendanceHistory();
  }, [loadAttendanceHistory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAttendanceHistory();
    setRefreshing(false);
  };

  // Alterna o status da presença de um aluno
  const handleToggleStatus = (item) => {
    const novoStatus = !item.presente;
    const acao = novoStatus ? 'Marcar como Presente' : 'Lançar Falta';

    Alert.alert(
      'Alterar Registro',
      `Deseja ${acao} para o aluno ${item.aluno_nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await apiClient(`/attendances/${item.id}`, {
                method: 'PUT',
                body: {
                  data: item.data.split('T')[0],
                  presente: novoStatus,
                },
              });
              loadAttendanceHistory();
            } catch (err) {
              Alert.alert('Erro ao atualizar', err.message || 'Falha ao conectar com o servidor.');
            }
          },
        },
      ]
    );
  };

  // Filtragem local por texto de busca e status
  const filteredRecords = useMemo(() => {
    return (data.registros || []).filter((item) => {
      const matchesSearch =
        item.aluno_nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aluno_matricula?.toLowerCase().includes(searchQuery.toLowerCase());

      const isPresent = item.presente === 1 || item.presente === true;
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PRESENT' && isPresent) ||
        (statusFilter === 'ABSENT' && !isPresent);

      return matchesSearch && matchesStatus;
    });
  }, [data.registros, searchQuery, statusFilter]);

  const formatRecordDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  const formatRecordTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    } catch {
      // fallback
    }
    return '';
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Seletor de Período */}
      <View style={styles.periodRow}>
        {PERIODS.map((period) => {
          const isSelected = selectedPeriod === period.id;
          return (
            <TouchableOpacity
              key={period.id}
              style={[styles.periodChip, isSelected && styles.periodChipActive]}
              onPress={() => setSelectedPeriod(period.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.periodChipText, isSelected && styles.periodChipTextActive]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Seletor de Turma */}
      {classes.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.xs, marginBottom: spacing.md }}
        >
          <TouchableOpacity
            style={[
              styles.statusTab,
              selectedTurmaId === 'ALL' && styles.statusTabActive,
            ]}
            onPress={() => setSelectedTurmaId('ALL')}
          >
            <Text
              style={[
                styles.statusTabText,
                selectedTurmaId === 'ALL' && styles.statusTabTextActive,
              ]}
            >
              Todas as Turmas
            </Text>
          </TouchableOpacity>

          {classes.map((c) => {
            const isSelected = String(selectedTurmaId) === String(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.statusTab, isSelected && styles.statusTabActive]}
                onPress={() => setSelectedTurmaId(c.id)}
              >
                <Text
                  style={[
                    styles.statusTabText,
                    isSelected && styles.statusTabTextActive,
                  ]}
                >
                  {c.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Cards de Métricas */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, { borderLeftColor: colors.primary }]}>
          <Text style={styles.metricLabel}>Total</Text>
          <Text style={[styles.metricValue, { color: colors.primary }]}>
            {data.resumo.totalRegistros}
          </Text>
          <Text style={styles.metricSub}>Registrados</Text>
        </View>

        <View style={[styles.metricCard, { borderLeftColor: colors.secondary }]}>
          <Text style={styles.metricLabel}>Presentes</Text>
          <Text style={[styles.metricValue, { color: colors.secondary }]}>
            {data.resumo.totalPresentes}
          </Text>
          <Text style={styles.metricSub}>Em sala</Text>
        </View>

        <View style={[styles.metricCard, { borderLeftColor: colors.error }]}>
          <Text style={styles.metricLabel}>Faltas</Text>
          <Text style={[styles.metricValue, { color: colors.error }]}>
            {data.resumo.totalFaltas}
          </Text>
          <Text style={styles.metricSub}>Ausentes</Text>
        </View>

        <View style={[styles.metricCard, { borderLeftColor: colors.accent || colors.highlight }]}>
          <Text style={styles.metricLabel}>Taxa</Text>
          <Text style={[styles.metricValue, { color: colors.accent || colors.highlight }]}>
            {data.resumo.taxaComparecimento}
          </Text>
          <Text style={styles.metricSub}>Frequência</Text>
        </View>
      </View>

      {/* Barra de Busca */}
      <View style={styles.searchBar}>
        <Feather name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou matrícula..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Feather name="x" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de Status */}
      <View style={styles.statusFiltersRow}>
        <TouchableOpacity
          style={[styles.statusTab, statusFilter === 'ALL' && styles.statusTabActive]}
          onPress={() => setStatusFilter('ALL')}
        >
          <Text style={[styles.statusTabText, statusFilter === 'ALL' && styles.statusTabTextActive]}>
            Todos ({data.registros.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusTab, statusFilter === 'PRESENT' && styles.statusTabActive]}
          onPress={() => setStatusFilter('PRESENT')}
        >
          <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
          <Text style={[styles.statusTabText, statusFilter === 'PRESENT' && styles.statusTabTextActive]}>
            Presentes ({data.resumo.totalPresentes})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusTab, statusFilter === 'ABSENT' && styles.statusTabActive]}
          onPress={() => setStatusFilter('ABSENT')}
        >
          <View style={[styles.dot, { backgroundColor: colors.error }]} />
          <Text style={[styles.statusTabText, statusFilter === 'ABSENT' && styles.statusTabTextActive]}>
            Faltas ({data.resumo.totalFaltas})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconBox}>
          <Feather name="calendar" size={36} color={colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Nenhum registro encontrado</Text>
        <Text style={styles.emptySubtitle}>
          {searchQuery
            ? 'Nenhum estudante corresponde à pesquisa atual.'
            : 'Não há registros de presença lançados no período selecionado.'}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const isPresent = item.presente === 1 || item.presente === true;
    const timeFormatted = formatRecordTime(item.data_registro);
    const dateFormatted = formatRecordDate(item.data);

    return (
      <TouchableOpacity
        style={styles.recordCard}
        activeOpacity={0.8}
        onPress={() => handleToggleStatus(item)}
      >
        <View style={styles.recordLeft}>
          <View
            style={[
              styles.avatarPlaceholder,
              { backgroundColor: isPresent ? colors.secondarySurface : colors.errorSurface },
            ]}
          >
            <Feather
              name={isPresent ? 'check' : 'user-x'}
              size={18}
              color={isPresent ? colors.secondary : colors.error}
            />
          </View>

          <View style={styles.studentInfo}>
            <Text style={styles.studentName} numberOfLines={1}>
              {item.aluno_nome}
            </Text>
            <View style={styles.metaRow}>
              {item.aluno_matricula ? (
                <Text style={styles.metaMatricula}>Matrícula: {item.aluno_matricula}</Text>
              ) : null}
              {item.turma_nome ? (
                <Text style={styles.metaMatricula}> • {item.turma_nome}</Text>
              ) : null}
              {selectedPeriod !== 'today' && selectedPeriod !== 'yesterday' ? (
                <Text style={styles.metaDate}> • {dateFormatted}</Text>
              ) : null}
            </View>
            <Text style={styles.metaRegisteredBy} numberOfLines={1}>
              {item.registrado_por_nome ? `Por: ${item.registrado_por_nome}` : 'Via Sistema'}
              {timeFormatted ? ` às ${timeFormatted}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.recordRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isPresent ? colors.secondarySurface : colors.errorSurface },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: isPresent ? colors.secondary : colors.error },
              ]}
            >
              {isPresent ? 'Presente' : 'Falta'}
            </Text>
          </View>
          <Feather name="edit-2" size={14} color={colors.textMuted} style={{ marginTop: 6 }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Histórico de Frequência</Text>
          <Text style={styles.headerSubtitle}>
            Acompanhe a assiduidade e lista de presença
          </Text>
        </View>
        <TouchableOpacity
          onPress={onRefresh}
          style={styles.refreshBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="refresh-cw" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando frequências...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    marginBottom: spacing.md,
  },
  periodRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  periodChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodChipText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  periodChipTextActive: {
    color: colors.textInverse,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    alignItems: 'center',
    ...shadows.card,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: 'Roboto_500Medium',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 10,
    fontFamily: 'Roboto_400Regular',
    color: colors.textMuted,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    height: '100%',
  },
  statusFiltersRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusTabActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySurface,
  },
  statusTabText: {
    fontSize: 12,
    fontFamily: 'Roboto_500Medium',
    color: colors.textSecondary,
  },
  statusTabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    marginRight: 6,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
  },
  recordCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaMatricula: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  metaDate: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  metaRegisteredBy: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  recordRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
});
