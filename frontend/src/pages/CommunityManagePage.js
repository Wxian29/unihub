import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import './CommunityManagePage.css';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'community_leader', label: 'Community Leader' },
  { value: 'member', label: 'mMember' },
];

const CommunityManagePage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [communityRes, membersRes] = await Promise.all([
        api.get(`/communities/${id}/`),
        api.get(`/communities/${id}/members/`)
      ]);
      setCommunity(communityRes.data);
      setEditName(communityRes.data.name);
      setEditDesc(communityRes.data.description);
      setMembers(Array.isArray(membersRes.data) ? membersRes.data : membersRes.data.results || []);
      setError(null);
    } catch (err) {
      setError('Failed to load community information');
    } finally {
      setLoading(false);
    }
  };

  // Remove Member
  const handleRemove = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    setSaving(true);
    try {
      await api.patch(`/communities/${id}/members/${memberId}/`, { is_active: false });
      await fetchData();
    } catch (err) {
      alert('Removal failed');
    } finally {
      setSaving(false);
    }
  };

  // Modify Role
  const handleRoleChange = async (memberId, newRole) => {
    setSaving(true);
    try {
      await api.patch(`/communities/${id}/members/${memberId}/`, { role: newRole });
      await fetchData();
    } catch (err) {
      console.error('Failed to modify role:', err.response?.data || err.message);
      alert(`Failed to modify role: ${err.response?.data?.detail || err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save community information
  const handleSaveInfo = async () => {
    if (!editName.trim()) {
      alert('Community name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/communities/${id}/`, { name: editName, description: editDesc });
      setEditMode(false);
      await fetchData();
    } catch (err) {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="community-manage-page"><div className="container"><div className="loading">loading...</div></div></div>;
  }
  if (error) {
    return <div className="community-manage-page"><div className="container"><div className="error-message">{error}</div></div></div>;
  }
  if (!community) {
    return null;
  }

  return (
    <div className="community-manage-page">
      <div className="container">
        <h1>Managing the community:{community.name}</h1>
        <div className="community-info">
          {editMode ? (
            <>
              <div className="form-group">
                <label>Community Name</label>
                <input
                  className="form-control"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="form-group">
                <label>Introduction</label>
                <textarea
                  className="form-control"
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  rows={3}
                  disabled={saving}
                />
              </div>
              <button className="btn btn-primary" onClick={handleSaveInfo} disabled={saving}>save</button>
              <button className="btn btn-outline" style={{marginLeft:8}} onClick={() => setEditMode(false)} disabled={saving}>cancel</button>
            </>
          ) : (
            <>
              <p><strong>Introduction:</strong>{community.description}</p>
              <p><strong>Number of Members:</strong>{community.member_count}</p>
              <button className="btn btn-outline" onClick={() => setEditMode(true)}>Edit community information</button>
            </>
          )}
        </div>
        <h2>Members List</h2>
        <div className="member-list">
          {members.length === 0 && <div>No members yet</div>}
          {members.map((member) => (
            <div className="member-item" key={member.id}>
              <span>{member.user_name}</span>
              <span className="role">{roleOptions.find(r => r.value === member.role)?.label || member.role}</span>
              <span>{member.is_active ? 'active' : 'removed'}</span>
              {member.is_active && (
                <>
                  <select
                    value={member.role}
                    onChange={e => handleRoleChange(member.id, e.target.value)}
                    disabled={saving}
                  >
                    {roleOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ marginLeft: 8 }}
                    onClick={() => handleRemove(member.id)}
                    disabled={saving}
                  >Remove</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityManagePage; 