import { useState } from 'react';
import { Button, Dropdown, TextInput, Modal, Tile } from '@carbon/react';
import { Checkmark, TrashCan, Add } from '@carbon/react/icons';
import ProjectDot from '../components/ProjectDot';
import ConfidenceBadge from '../components/ConfidenceBadge';
import SourceTag from '../components/SourceTag';
import ProgressRing from '../components/ProgressRing';
import { calcHours, totalHours, billableHours } from '../utils/timeHelpers';
import { PROJECTS } from '../data/mockData';
import type { TimeEntry, Project } from '../types';

interface ReviewScreenProps {
  entries: TimeEntry[];
  onUpdateEntry: (id: number, updates: Partial<TimeEntry>) => void;
  onDeleteEntry: (id: number) => void;
  onAddEntry: () => void;
  onConfirmAll: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({
  entries,
  onUpdateEntry,
  onDeleteEntry,
  onAddEntry,
  onConfirmAll,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const allConfirmed = entries.length > 0 && entries.every((e) => e.confirmed);
  const unconfirmedCount = entries.filter((e) => !e.confirmed).length;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* HEADER SECTION */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <p style={{ color: '#525252', marginBottom: '0.25rem' }}>
            Friday, March 13
          </p>
          <h2 style={{ margin: 0 }}>AI-generated timesheet</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ProgressRing value={totalHours(entries)} max={8} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600 }}>{totalHours(entries)}h total</div>
            <div style={{ color: '#525252', fontSize: '0.875rem' }}>
              {billableHours(entries)}h billable
            </div>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {entries.length === 0 && (
        <Tile style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ marginBottom: '1rem', color: '#525252' }}>
            No time entries yet for today.
          </p>
          <Button kind="primary" renderIcon={Add} onClick={onAddEntry}>
            Add your first entry
          </Button>
        </Tile>
      )}

      {/* ENTRY LIST */}
      {entries.map((entry) => {
        const isGap = entry.source === 'gap';
        const isExpanded = expandedId === entry.id;

        let borderLeftStyle = '4px solid transparent';
        if (entry.confirmed) {
          borderLeftStyle = '4px solid #198038';
        } else if (isGap) {
          borderLeftStyle = '4px solid #f1c21b';
        }

        return (
          <div
            key={entry.id}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-label={`${entry.project?.name || 'Unassigned'} ${entry.start}–${entry.end}${entry.confirmed ? ', confirmed' : ''}`}
            onClick={() =>
              setExpandedId(isExpanded ? null : entry.id)
            }
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setExpandedId(isExpanded ? null : entry.id);
              }
            }}
            style={{
              cursor: 'pointer',
              padding: '1rem',
              marginBottom: '0.5rem',
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              borderLeft: borderLeftStyle,
            }}
          >
            {/* NORMAL ENTRY */}
            {!isGap && (
              <div style={{ display: 'flex' }}>
                {/* Time column */}
                <div style={{ width: 90, flexShrink: 0 }}>
                  <div style={{ fontWeight: 600 }}>
                    {entry.start}&ndash;{entry.end}
                  </div>
                  <div style={{ color: '#525252', fontSize: '0.875rem' }}>
                    {calcHours(entry.start, entry.end)}h
                  </div>
                </div>
                {/* Content column */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <ProjectDot color={entry.project?.color || '#ccc'} />
                    <span style={{ fontWeight: 600 }}>
                      {entry.project?.name || 'Unassigned'}
                    </span>
                    <ConfidenceBadge level={entry.confidence} />
                    <SourceTag source={entry.source} />
                    {entry.confirmed && (
                      <Checkmark size={16} style={{ color: '#198038' }} />
                    )}
                  </div>
                  <p
                    style={{
                      color: '#525252',
                      margin: '0.25rem 0 0',
                      fontSize: '0.875rem',
                    }}
                  >
                    {entry.task}
                  </p>
                </div>
              </div>
            )}

            {/* GAP ENTRY */}
            {isGap && (
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                  Unrecognized gap ({entry.start}&ndash;{entry.end})
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    kind="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onUpdateEntry(entry.id, {
                        project: PROJECTS[1],
                        task: 'Client meeting',
                        source: 'manual',
                        confidence: 'high',
                        confirmed: true,
                      });
                    }}
                  >
                    Meeting
                  </Button>
                  <Button
                    kind="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onUpdateEntry(entry.id, {
                        project: PROJECTS[0],
                        task: 'Focus work',
                        source: 'manual',
                        confidence: 'medium',
                        confirmed: true,
                      });
                    }}
                  >
                    Focus work
                  </Button>
                  <Button
                    kind="ghost"
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onUpdateEntry(entry.id, {
                        project: PROJECTS[2],
                        task: 'Break',
                        source: 'manual',
                        confidence: 'high',
                        confirmed: true,
                      });
                    }}
                  >
                    Break
                  </Button>
                </div>
              </div>
            )}

            {/* EXPANDED EDIT FORM */}
            {isExpanded && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  paddingTop: '1rem',
                  marginTop: '1rem',
                  borderTop: '1px solid #e0e0e0',
                }}
              >
                <Dropdown
                  id={`project-select-${entry.id}`}
                  titleText="Project"
                  label="Select project"
                  items={PROJECTS}
                  itemToString={(p: Project) => (p ? p.name : '')}
                  selectedItem={entry.project}
                  onChange={({
                    selectedItem,
                  }: {
                    selectedItem: Project | null;
                  }) => {
                    if (selectedItem)
                      onUpdateEntry(entry.id, { project: selectedItem });
                  }}
                />
                <TextInput
                  id={`task-input-${entry.id}`}
                  labelText="Task"
                  value={entry.task}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onUpdateEntry(entry.id, { task: e.target.value })
                  }
                  style={{ marginTop: '0.5rem' }}
                />
                <div
                  style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    gap: '0.5rem',
                  }}
                >
                  <Button
                    kind="primary"
                    size="sm"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onUpdateEntry(entry.id, { confirmed: true });
                      setExpandedId(null);
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    kind="danger--ghost"
                    size="sm"
                    renderIcon={TrashCan}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setDeleteTargetId(entry.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* BOTTOM SECTION */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.5rem',
        }}
      >
        <Button kind="ghost" renderIcon={Add} onClick={onAddEntry}>
          Add entry
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!allConfirmed && entries.length > 0 && (
            <span style={{ color: '#525252', fontSize: '0.875rem' }}>
              {unconfirmedCount} {unconfirmedCount === 1 ? 'entry' : 'entries'} still need review
            </span>
          )}
          <Button
            kind="primary"
            disabled={!allConfirmed}
            onClick={onConfirmAll}
          >
            Confirm all
          </Button>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        open={deleteTargetId !== null}
        danger
        modalHeading="Delete entry"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onRequestClose={() => setDeleteTargetId(null)}
        onRequestSubmit={() => {
          if (deleteTargetId !== null) {
            onDeleteEntry(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
      >
        <p>Are you sure you want to delete this time entry? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default ReviewScreen;
